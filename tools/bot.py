import asyncio, sys, math, time
from playwright.async_api import async_playwright
DAY=int(sys.argv[1]); W,H=(int(sys.argv[2]),int(sys.argv[3])) if len(sys.argv)>3 else (1600,900)
SHOTS=sys.argv[4] if len(sys.argv)>4 else ''
OUT='review/'
import os; os.makedirs(OUT,exist_ok=True)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':W,'height':H})
    errs=[];pg.on('pageerror',lambda e:errs.append('JS '+str(e)));pg.on('response',lambda r: errs.append('404 '+r.url) if r.status==404 else None)
    await pg.goto('http://localhost:8765/index.html');await pg.wait_for_timeout(1200)
    await pg.evaluate(f"SV.unlocked=7;SV.bank=500000;"+("startEndless()" if DAY==8 else f"startDay({DAY})"))
    async def box(sel):
      return await pg.evaluate("s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]}",sel)
    async def drag(a,b,steps=12,hold=0):
      await pg.mouse.move(*a);await pg.mouse.down();await pg.mouse.move(*b,steps=steps)
      if hold: await pg.wait_for_timeout(hold)
      await pg.mouse.up()
    t0=time.time();shot_i=0;last=''
    LIM=int(os.environ.get('BOTLIM','600'))
    while time.time()-t0<LIM:
      st=await pg.evaluate("""()=>({vn:VN.on,card:!document.getElementById('ov').classList.contains('hidden'),cardHtml:document.getElementById('card').innerText.slice(0,80),
        step:S.step,busy:!!S.busy,cur:S.cur?{id:S.cur.id,o:S.cur.order,gag:S.cur.gag,rev:!!S.cur.revealed}:null,placed:S.placed,
        coins:document.querySelectorAll('.coin').length,choices:document.getElementById('choices').children.length,dogRun:!!S.dogRun,crying:!!S.crying,
        tk:!!document.getElementById('tkBtn'),dStep:S.dStep,dLevel:S.dLevel,skip:document.getElementById('skipBtn').style.display==='block',contest:!!S.contest})""")
      if st['cur'] and st['cur']['id']=='be_ti' and time.time()-globals().get('PT',0)>1.5:
        globals()['PT']=time.time();print('T',round(time.time()-t0,1),st['step'],st['busy'],st['coins'],st['choices'],await pg.evaluate('Math.round(S.cur&&S.cur.p)'),flush=True)
      if st['vn']:
        await pg.mouse.click(W*0.9,H*0.15);await pg.wait_for_timeout(60);await pg.mouse.click(W*0.9,H*0.15);await pg.wait_for_timeout(120);continue
      if st['card']:
        await pg.screenshot(path=OUT+f'd{DAY}_end.png');print('CARD:',st['cardHtml'].replace('\n',' | '));break
      if st['coins']:
        for el in await pg.locator('.coin').all():
          try: await el.click(timeout=300,force=True)
          except: pass
        continue
      if st['choices']:
        await pg.click('#chA');await pg.wait_for_timeout(300);continue
      if st['crying']:
        for _ in range(3):
          c=await box('#chloe');await pg.mouse.click(c[0],c[1]);await pg.wait_for_timeout(120)
      if st['dogRun']:
        c=await box('#dog');await pg.mouse.click(c[0],c[1]);await pg.wait_for_timeout(200);continue
      if not st['cur'] or st['busy']:
        await pg.wait_for_timeout(300);continue
      if st['tk']:
        await pg.click('#tkBtn');await pg.wait_for_timeout(200);continue
      s=st['step'];o=st['cur']['o']
      key=(st['cur']['id'],s,st['dStep']);now=time.time()
      if key!=globals().get('LK'): globals()['LK']=key;globals()['LT']=now
      elif now-globals()['LT']>6 and not globals().get('DB'+str(key)): globals()['DB'+str(key)]=1;print('STUCK',key,o);await pg.screenshot(path=OUT+f'stuck_{st["cur"]["id"]}_{s}.png')
      if SHOTS and s!=last and s in SHOTS.split(','):
        await pg.screenshot(path=OUT+f'd{DAY}_{shot_i:02d}_{s}.png');shot_i+=1
      last=s
      bb=await box('#breadBox')
      if s=='slice':
        await drag((bb[0]-bb[2]*.45,bb[1]),(bb[0]+bb[2]*.45,bb[1]),steps=18);await pg.wait_for_timeout(350)
      elif s in('butter','pate'):
        if (s=='butter' and o['noButter']) or (s=='pate' and o['noPate']):
          await pg.click('#skipBtn',force=True);await pg.wait_for_timeout(300);continue
        bw=await box('#butterBowl' if s=='butter' else '#pateBowl');await pg.mouse.click(bw[0],bw[1]);await pg.wait_for_timeout(120)
        await pg.mouse.move(bb[0]-bb[2]*.3,bb[1]);await pg.mouse.down()
        for _ in range(8):
          await pg.mouse.move(bb[0]+bb[2]*.3,bb[1],steps=5);await pg.mouse.move(bb[0]-bb[2]*.3,bb[1],steps=5)
        await pg.mouse.up();await pg.wait_for_timeout(350)
      elif s=='fill':
        need=[k for k,n in o['req'].items() for _ in range(max(0,n-st['placed'].get(k,0)))]
        if not need: await pg.wait_for_timeout(300);continue
        k=need[0];t=await box(f'.tray[data-k="{k}"]')
        await drag((t[0],t[1]),(bb[0],bb[1]),steps=8);await pg.wait_for_timeout(250)
      elif s=='sauce':
        bt=await box('#b_'+o['sauce']);await pg.mouse.move(bt[0],bt[1]);await pg.mouse.down();await pg.mouse.move(bb[0],bb[1],steps=6);await pg.wait_for_timeout(1900);await pg.mouse.up();await pg.wait_for_timeout(500)
      elif s=='wrap':
        await pg.mouse.click(bb[0],bb[1]);await pg.wait_for_timeout(600)
      elif s=='drink':
        ds=await pg.evaluate("(()=>{const s=curDStep();if(!s)return null;return {t:s.t,item:s.item||null,n:s.n||0,band:s.t==='hold'?bandFor(s):null,fruit:S.cur.order.fruit}})()")
        if not ds: await pg.wait_for_timeout(200);continue
        if SHOTS and 'drink' in SHOTS: await pg.screenshot(path=OUT+f'd{DAY}_{shot_i:02d}_drink_{ds["t"]}.png');shot_i+=1
        cup=await box('#cupBox')
        if ds['t']=='tap':
          it=await box(f'.ditem[data-k="{ds["item"]}"]')
          for _ in range(ds['n']): await pg.mouse.click(it[0],it[1]);await pg.wait_for_timeout(300)
        elif ds['t']=='fruit':
          it=await box(f'.ditem[data-k="{ds["fruit"]}"]');await pg.mouse.click(it[0],it[1]);await pg.wait_for_timeout(300)
        elif ds['t']=='hold':
          it=await box(f'.ditem[data-k="{ds["item"]}"]');await pg.mouse.move(it[0],it[1]);await pg.mouse.down()
          target=(ds['band'][0]+ds['band'][1])/2
          for _ in range(300):
            lv=await pg.evaluate("S.dLevel")
            if lv>=target: break
            await pg.wait_for_timeout(40)
          await pg.mouse.up();await pg.wait_for_timeout(400)
        elif ds['t']=='stir':
          await pg.mouse.move(cup[0]+60,cup[1]);await pg.mouse.down()
          for i in range(80):
            a=i*0.45;await pg.mouse.move(cup[0]+60*math.cos(a),cup[1]+60*math.sin(a))
          await pg.mouse.up();await pg.wait_for_timeout(400)
        elif ds['t']=='shake':
          await pg.mouse.move(cup[0],cup[1]-80);await pg.mouse.down()
          for i in range(14):
            await pg.mouse.move(cup[0],cup[1]+80,steps=3);await pg.mouse.move(cup[0],cup[1]-80,steps=3)
          await pg.mouse.up();await pg.wait_for_timeout(400)
      elif s=='give':
        await drag((bb[0],bb[1]),(bb[0],bb[1]-bb[3]*1.6),steps=10);await pg.wait_for_timeout(400)
      else:
        await pg.wait_for_timeout(200)
    print("LOG",await pg.evaluate("window.__LOG"))
    res=await pg.evaluate("({money:S.money,happy:S.happy,served:S.served,lost:S.lost,unlocked:SV.unlocked,stars:SV.stars})")
    print('DAY',DAY,'result',res,'time',round(time.time()-t0))
    print('ERRORS:',sorted(set(errs)))
    await b.close()
asyncio.run(main())
