/* Bánh Mì A Huy — game engine */
const $=id=>document.getElementById(id), stage=$('stage');
let LANG='vi',SOUND=true,MUSIC=true,SC=1;
const say_=o=>!o?'':typeof o==='string'?o:(o[LANG]||o.vi);
const fmt=n=>Math.round(n).toLocaleString('vi-VN')+'đ';
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const UI={
 slice:L('Cầm dao, kéo ngang qua ổ bánh để xẻ','Drag the knife across the bread'),
 butter:L('Chấm vào chén bơ, rồi phết lên bánh','Dip into the butter, then spread it'),
 pate:L('Chấm vào chén pa-tê, rồi phết lên bánh','Dip into the pâté, then spread it'),
 fill:L('Bốc nhân trong khay, thả vào ổ bánh','Grab fillings from the trays, drop them in'),
 sauce:L('Cầm chai, giữ trên bánh để xịt','Pick a bottle, hold it over the bread'),
 wrap:L('Chạm vào ổ bánh để gói','Tap the bread to wrap it'),
 give:L('Kéo đồ lên đưa cho khách','Drag the order up to the customer'),
 coins:L('Lụm tiền xu của Bé Tí!','Grab Bé Tí\'s coins!'),
 patience:L('Kiên nhẫn','Patience'),waiting:L('Đang chờ','Waiting'),
 noButter:L('🚫 Không bơ','🚫 No butter'),noPate:L('🚫 Không pa-tê','🚫 No pâté'),
 noChili:L('KHÔNG ỚT!','NO CHILI!'),noCil:L('KHÔNG NGÒ!','NO CILANTRO!'),noVeg:L('KHÔNG RAU!','NO VEGGIES!'),
 usual:L('"Như mọi khi…"','"The usual…"'),book:L('📒 Xem sổ tay','📒 Check notebook'),ask:L('📝 Hỏi lại','📝 Ask again'),
 strong:L('ĐẬM!','STRONG!'),unit:L('Ổ','Loaf'),bagged:L('Đã gói','Bagged'),
 rain:L('Mưa bất chợt!','Sudden rain!'),power:L('Cúp điện!','Power cut!'),speakerOn:L('Loa nhà Kevin bật hết cỡ!','Kevin\'s speaker is blasting!'),
 rumor:L('Tin đồn: sai 1 lần là khách bỏ đi!','Rumor day: one mistake and they leave!'),
 chloeCry:L('Chloe khóc! Chạm vào bé để dỗ','Chloe is crying! Tap her to calm her'),
 day:L('Ngày','Day'),earned:L('Tiền hôm nay','Today\'s earnings'),happyC:L('Khách hài lòng','Happy customers'),
 next:L('Ngày tiếp ▶','Next day ▶'),again:L('Chơi lại','Replay'),menu:L('☰ Menu','☰ Menu'),
 shop:L('Cửa hàng nâng cấp','Upgrade shop'),bank:L('Quỹ của tiệm','Stall savings'),buy:L('Mua','Buy'),owned:L('Đã có','Owned'),
 round:L('Vòng','Round'),score:L('Điểm','Score'),contest:L('Hội thi','Contest'),
};
/* ---------- save ---------- */
const SAVE_KEY='banhmi_ahuy_v2';
let SV={unlocked:1,best:{},stars:{},bank:0,up:{},lottery:0};
try{const o=JSON.parse(localStorage.getItem(SAVE_KEY));if(o)SV=Object.assign(SV,o)}catch(e){}
const saveSV=()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify(SV))}catch(e){}};
const has=k=>!!SV.up[k];
/* ---------- audio: sfx, voice, music ---------- */
let AC=null;const ac=()=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return AC};
function tone(f,d=.12,type='sine',v=.15,slide=0,when=0,dest){if(!SOUND&&!dest)return;const a=ac();if(!a)return;try{const t=a.currentTime+when,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.linearRampToValueAtTime(Math.max(40,f+slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(dest||a.destination);o.start(t);o.stop(t+d+.02)}catch(e){}}
const sfx={ding:()=>{tone(880,.15);tone(1320,.2,'sine',.15,0,.09)},bad:()=>tone(160,.25,'square',.07),swish:()=>tone(700,.2,'triangle',.1,-500),coin:()=>{tone(1200,.08,'square',.05);tone(1600,.1,'square',.05,0,.06)},pop:()=>tone(620,.07,'triangle',.12),plop:()=>tone(300,.09,'sine',.18,-120),bark:()=>clip('dog',()=>{tone(420,.12,'sawtooth',.07,-150);tone(380,.12,'sawtooth',.07,-150,.17)}),meo:()=>clip('cat',()=>tone(900,.3,'triangle',.05,-400)),pour:()=>tone(200+Math.random()*80,.06,'sawtooth',.025),ice:()=>{tone(2200,.05,'square',.03);tone(1800,.05,'square',.03,0,.05)},cheer:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.1,0,i*.08))}};
let VOICE=null;const CBUF={};
function clip(name,fb){if(!SOUND)return;const a=ac();if(!a||CBUF[name]===false)return fb&&fb();const go=b=>{try{if(a.state!=='running')a.resume();const src=a.createBufferSource(),g=a.createGain();g.gain.value=.9;src.buffer=b;src.connect(g).connect(a.destination);src.start()}catch(e){}};
 if(CBUF[name])return go(CBUF[name]);fb&&fb();fetch('assets/sfx/'+name+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(ab=>new Promise((ok,no)=>{const p=a.decodeAudioData(ab,ok,no);if(p&&p.then)p.then(ok,no)})).then(b=>CBUF[name]=b).catch(()=>CBUF[name]=false)}
const VBUF={};let VSRC=null;
function voiceHtml(key){try{if(VOICE)VOICE.pause();VOICE=new Audio('assets/vo/'+key+'.mp3');VOICE.volume=.95;VOICE.play().catch(()=>{})}catch(e){}}
function voice(key){if(!SOUND||!key||(window.VO_OK&&!VO_OK.has(key)))return;const a=ac();if(!a||!window.fetch)return voiceHtml(key);
 const play=b=>{try{if(VSRC)VSRC.stop()}catch(e){}try{if(a.state!=='running')a.resume();const src=a.createBufferSource(),g=a.createGain();g.gain.value=1.1;src.buffer=b;src.connect(g).connect(a.destination);src.start();VSRC=src}catch(e){}};
 if(VBUF[key])return play(VBUF[key]);const t0=performance.now();
 fetch('assets/vo/'+key+'.mp3').then(r=>r.arrayBuffer()).then(ab=>new Promise((ok,no)=>{const p=a.decodeAudioData(ab,ok,no);if(p&&p.then)p.then(ok,no)})).then(b=>{VBUF[key]=b;if(performance.now()-t0<1800)play(b)}).catch(()=>voiceHtml(key))}
function preloadVoices(keys){const a=ac();if(!a||!window.fetch)return;keys.forEach(k=>{if(VBUF[k]||(window.VO_OK&&!VO_OK.has(k)))return;fetch('assets/vo/'+k+'.mp3').then(r=>r.arrayBuffer()).then(ab=>new Promise((ok,no)=>{const p=a.decodeAudioData(ab,ok,no);if(p&&p.then)p.then(ok,no)})).then(b=>VBUF[k]=b).catch(()=>{})})}
['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,()=>{const a=ac();if(a&&a.state!=='running')a.resume().catch(()=>{})},{capture:true,passive:true}));
const cv=(c,mood)=>{if(S.mute)return;const v=CHARS[c.id]&&CHARS[c.id].voice;if(v)voice(v+'_'+VO[mood])};
/* procedural music: Vietnamese-pentatonic loops */
const MUS={on:false,timer:null,gain:null,step:0,mode:'day'};
const SCALE=[0,2,4,7,9];
const MOTIFS={day:[[0,2,4,2,7,4,2,0],[4,7,9,7,4,2,4,-1],[2,4,7,9,12,9,7,4],[7,4,2,0,2,-1,0,-1]],eve:[[0,-1,4,-1,7,-1,4,-1],[2,-1,4,-1,0,-1,-1,-1]],contest:[[0,4,7,12,7,4,0,4],[2,5,9,14,9,5,2,5],[4,7,11,16,11,7,4,7],[7,4,2,0,-1,0,2,4]]};
function startMusic(mode){MUS.mode=mode||MUS.mode;if(!MUSIC)return stopMusic();const a=ac();if(!a)return;if(!MUS.gain){MUS.gain=a.createGain();MUS.gain.gain.value=.5;MUS.gain.connect(a.destination)}
 if(MUS.timer)return;MUS.step=0;const tick=()=>{const m=MOTIFS[MUS.mode],bpm=MUS.mode==='contest'?150:MUS.mode==='eve'?84:116,beat=60/bpm/2;
  for(let i=0;i<8;i++){const bar=m[(MUS.step)%m.length],n=bar[i];const base=MUS.mode==='eve'?60:64;
   if(n>=0){const midi=base+n;tone(440*Math.pow(2,(midi-69)/12),beat*.9,'triangle',.06,0,i*beat,MUS.gain)}
   if(i%4===0){const root=[0,5,7,0][MUS.step%4];tone(440*Math.pow(2,(base-24+root-69)/12),beat*1.8,'sine',.09,0,i*beat,MUS.gain)}
   if(MUS.mode!=='eve'&&i%2===1)tone(5000,.02,'square',.012,0,i*beat,MUS.gain)}
  MUS.step++;MUS.timer=setTimeout(tick,beat*8*1000)};tick();MUS.on=true}
function stopMusic(){clearTimeout(MUS.timer);MUS.timer=null;MUS.on=false}
function setMusic(mode){if(MUS.mode!==mode){MUS.mode=mode}if(MUSIC&&!MUS.timer)startMusic(mode)}
/* ---------- layout ---------- */
function fit(){const de=document.documentElement,vv=window.visualViewport;const W=(vv&&vv.width)||de.clientWidth||innerWidth,H=(vv&&vv.height)||de.clientHeight||innerHeight;SC=Math.min(W/1600,H/900);stage.style.transform=`translate(${(W-1600*SC)/2}px,${(H-900*SC)/2}px) scale(${SC})`;$('rot').style.display=(H>W&&W<760&&!window._rotOk)?'flex':'none'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,250));if(window.visualViewport)visualViewport.addEventListener('resize',fit);$('rotOk').onclick=()=>{window._rotOk=1;fit()};
function R(el){const r=el.getBoundingClientRect(),s=stage.getBoundingClientRect();return{x:(r.left-s.left)/SC,y:(r.top-s.top)/SC,w:r.width/SC,h:r.height/SC}}
const inR=(p,r,pad=0)=>p.x>=r.x-pad&&p.x<=r.x+r.w+pad&&p.y>=r.y-pad&&p.y<=r.y+r.h+pad;
/* ---------- trays & drink items ---------- */
const TRAY={cha_lua:'trays_cha_lua',ham:'trays_ham',xa_xiu:'trays_xa_xiu',xiu_mai:'trays_xiu_mai_pot',egg:'trays_egg_pan',do_chua:'trays_do_chua',cucumber:'trays_cucumber',green_onion:'trays_green_onion',cilantro:'trays_cilantro',chili:'trays_chili'};
const PIECE={cha_lua:'pieces_cha_lua',ham:'pieces_ham',xa_xiu:'pieces_xa_xiu',xiu_mai:'pieces_xiu_mai',egg:'pieces_fried_egg',do_chua:'pieces_do_chua',cucumber:'pieces_cucumber',green_onion:'pieces_green_onion',cilantro:'pieces_cilantro',chili:'pieces_chili'};
const TRAY_ORDER=['cha_lua','ham','xa_xiu','xiu_mai','egg','do_chua','cucumber','green_onion','cilantro','chili'];
function buildTrays(){$('trays').innerHTML=TRAY_ORDER.map(k=>`<div class="tray${(k==='xa_xiu'||k==='xiu_mai')&&S.day<4?' locked':''}" data-k="${k}"><img src="assets/${TRAY[k]}.webp" alt=""><span class="lbl">${say_(ING[k])}</span></div>`).join('')}
function labels(){document.querySelectorAll('[data-t]').forEach(e=>e.textContent=say_(SAUCES[e.dataset.t]||{vi:e.dataset.t==='butter'?'Bơ':'Pa-tê',en:e.dataset.t==='butter'?'Butter':'Pâté'}));$('langBtn').textContent=LANG==='vi'?'EN':'VI';$('patL').textContent=say_(UI.patience);if(S.day)buildTrays()}
/* ---------- hand ---------- */
const HOT={open:[.45,.05],pinch:[.13,.2],bread_knife:[.13,.04],spread_knife:[.2,.05],fist:[.5,.25],point:[.13,.04],thumbs_up:[.3,.1],squeeze_bottle:[.4,.1]};
let P={x:800,y:620},handPose='open',carry=null;
function setPose(p){if(handPose===p)return;handPose=p;$('hand').src='assets/hands_'+p+'.webp';drawHand()}
function drawHand(){const h=$('hand'),w=200,hh=w*1.45,[hx,hy]=HOT[handPose]||[.4,.05];let y=P.y;if(carry&&carry.type==='bottle')y=P.y-90;if(carry&&carry.type==='bread')y=P.y+40;
 h.style.transform=`translate(${P.x-hx*w}px,${y-hy*hh}px)`;const c=$('carry');if(!carry){c.style.display='none';return}c.style.display='block';
 if(carry.type==='piece'){c.style.width=(carry.k==='egg'?150:115)+'px';c.style.transform=`translate(${P.x-55}px,${P.y-35}px) rotate(${carry.rot}deg)`}
 if(carry.type==='bottle'){c.style.width='72px';c.style.transform=`translate(${P.x-36}px,${P.y-185}px) rotate(180deg)`}
 if(carry.type==='spread'){c.style.width='70px';c.style.transform=`translate(${P.x-30}px,${P.y-20}px)`}
 if(carry.type==='bread'){c.style.width='300px';c.style.transform=`translate(${P.x-150}px,${P.y-110}px) rotate(-8deg)`}
 if(carry.type==='ditem'){c.style.width='120px';c.style.transform=`translate(${P.x-60}px,${P.y-100}px)${carry.tilt?' rotate(-55deg)':''}`}}
function setCarry(o){carry=o;if(o)$('carry').src='assets/'+o.src+'.webp';drawHand()}
/* ---------- state ---------- */
let S={};
function huySay(o,face,vo){if(face)$('huyAv').style.backgroundImage=`url(assets/a_huy_${face}.webp)`;const b=$('hbub');if(!o){b.classList.remove('show');return}b.textContent=say_(o);b.classList.add('show');if(vo)voice(vo);clearTimeout(b._t);b._t=setTimeout(()=>{b.classList.remove('show');$('huyAv').style.backgroundImage='url(assets/a_huy_happy.webp)'},2600)}
function say(o,ms){const b=$('bubble');b.textContent=S.speaker&&!S.asked?'♪♫ ~ ♪♫♪ ~ ♫♪':say_(o);b.classList.add('show');clearTimeout(b._t);if(ms)b._t=setTimeout(()=>b.classList.remove('show'),ms)}
function meo(){const m=$('mbub');m.classList.add('show');sfx.meo();setTimeout(()=>m.classList.remove('show'),1500)}
function face(f,c){c=c||S.cur;if(!c)return;const ch=CHARS[c.id],h=$('custHead'),body=$('cust');S.face=f;body.style.visibility='visible';
 if(ch.special==='coba'){if(f==='eating'){body.src='assets/co_ba_front.webp';const k=640/617*1.12;const place=()=>{const hh=h.naturalHeight*k,ww=h.naturalWidth*k;h.style.height=hh+'px';h.style.top=(515-hh)+'px';h.style.left=((body.offsetWidth||344)-ww)/2+'px';body.style.visibility='hidden'};h.onload=place;h.src='assets/co_ba_eating.webp';h.style.display='block';if(h.complete&&h.naturalHeight)place();return}
  if(f==='front'){h.style.display='none';body.src='assets/co_ba_front.webp';return}
  body.src='assets/co_ba_front.webp';const k=640/617;h.onload=()=>{h.style.height=(h.naturalHeight*k)+'px'};h.src='assets/co_ba_'+f+'.webp';if(h.complete&&h.naturalHeight)h.style.height=(h.naturalHeight*k)+'px';h.style.left=(7*k)+'px';h.style.top=(-1*k)+'px';h.style.display='block';return}
 h.style.display='none';body.src=`assets/c_${c.id}_${ch.faces[f]||ch.faces.front}.webp`;body.style.height=(ch.h||640)+'px'}
function banner(o){const b=$('banner');if(!o){b.classList.remove('show');return}b.textContent=say_(o);b.classList.add('show')}
function toast(o,ms=2200){const t=$('toast');t.textContent=say_(o);t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),ms)}
function setMoney(){$('money').textContent=fmt(S.money||0)}
function tutOn(){return !S.contest&&!S.endless&&((S.day===1&&S.served===0)||(S.day===2&&S.served<2&&S.step==='drink'))}
function ghostStop(){const g=$('ghost');if(!g)return;if(g._a)g._a.cancel();g.style.display='none'}
function ghostMove(a,b,dur=1700){const g=$('ghost');if(!g||!a)return;ghostStop();const sr=$('stage').getBoundingClientRect(),sc=sr.width/1600;
 const c=e=>{if(Array.isArray(e))return e;const r=e.getBoundingClientRect();return[(r.left-sr.left+r.width/2)/sc,(r.top-sr.top+r.height/2)/sc]};const A=c(a),B=c(b||a);
 const T=(p,k)=>`translate(${p[0]-30}px,${p[1]-10}px) scale(${k})`;g.style.display='block';
 g._a=g.animate([{transform:T(A,1.1),opacity:0},{offset:.12,transform:T(A,.92),opacity:.8},{offset:.22,transform:T(A,.85),opacity:.8},{offset:.78,transform:T(B,.85),opacity:.8},{offset:.9,transform:T(B,1),opacity:.6},{transform:T(B,1.1),opacity:0}],{duration:dur,iterations:Infinity})}
function tutGhost(){if(!tutOn()||!S.cur||S.busy){ghostStop();return}const st=S.step,bb=$('breadBox');
 if(st==='slice'){const r=bb.getBoundingClientRect(),sr=$('stage').getBoundingClientRect(),sc=sr.width/1600,y=(r.top-sr.top+r.height*.5)/sc;return ghostMove([(r.left-sr.left+r.width*.12)/sc,y],[(r.left-sr.left+r.width*.88)/sc,y],1500)}
 if(st==='butter'||st==='pate')return ghostMove($(st==='butter'?'butterBowl':'pateBowl'),bb);
 if(st==='fill'||st==='sauce'){const h=document.querySelector((st==='fill'?'#trays':'#bottles')+' .hint');return h?ghostMove(h,bb):ghostStop()}
 if(st==='wrap')return ghostMove(bb,bb,1200);
 if(st==='give')return ghostMove(bb,$('custWrap'));
 if(st==='drink'){const h=document.querySelector('.ditem.hint');return h?ghostMove(h,$('cupBox')):ghostMove($('cupBox'),$('cupBox'),1200)}
 ghostStop()}
function hint(els){document.querySelectorAll('.hint').forEach(e=>e.classList.remove('hint'));(els||[]).forEach(e=>e&&e.classList.add('hint'))}
/* ---------- orders ---------- */
function makeOrder(o,cid){o=Object.assign({},o||{});
 if(cid==='chu_tu'&&!o.r){o.r='cha_lua';o.drink='cafe'}
 const r=o.r==='egg_only'?{n:L('Bánh mì trứng','Egg bánh mì'),req:{egg:1},price:15000}:RECIPES[o.r||'cha_lua'];
 const req=Object.assign({},r.req);if(o.chili)req.chili=1;if(o.noCilantro)delete req.cilantro;
 if(o.extraMeat){const mk=Object.keys(req).find(k=>MEAT.includes(k));if(mk)req[mk]=2}
 const ord={rk:o.r||'cha_lua',name:r.n,req,price:r.price,qty:o.qty||1,sauce:o.sauce||'soy',noChili:!!o.noChili,noCil:!!o.noCilantro,noVeg:o.r==='egg_only',noButter:!!o.noButter,noPate:!!o.noPate,drink:o.drink||null,strong:!!o.strong};
 if(ord.drink==='nuoc_ep')ord.fruit=rnd(Object.keys(FRUITS));
 ord.total=ord.price*ord.qty+(ord.drink?DRINKS[ord.drink].price:0);return ord}
function orderLine(c){const o=c.order;let s=say_(o.name);if(o.qty>1)s=o.qty+' × '+s;if(o.drink)s+=' + '+say_(DRINKS[o.drink].n)+(o.fruit?' ('+say_(FRUITS[o.fruit].n)+')':'');return s}
function ticket(){const c=S.cur,t=$('ticket');if(!c){t.style.display='none';return}t.style.display='block';const o=c.order;
 const hidden=(c.gag==='usual'&&!c.revealed)||(S.speaker&&!S.asked);
 let h=`<h3>${CHARS[c.id].name}</h3>`;
 if(hidden){h+=`<div class="dish">${c.gag==='usual'?say_(UI.usual):'♪♫♪'}</div><button class="tbtn tk" id="tkBtn">${say_(c.gag==='usual'?UI.book:UI.ask)}</button>`;t.innerHTML=h;$('tkBtn').onpointerdown=e=>{e.stopPropagation();if(c.gag==='usual')c.revealed=1;else S.asked=1;c.p=Math.max(5,c.p-10);sfx.pop();ticket();say(c.gag==='usual'?L('Chả lụa với cà phê sữa đá, như mọi khi!','Pork roll and iced coffee, as always!'):c.hi,2600)};return}
 const eng=c.gag==='english'&&LANG==='vi';const nm=k=>eng?ING[k].en:say_(ING[k]);
 h+=`<div class="dish">${eng?o.name.en:say_(o.name)}${o.qty>1?` <span class="qty">×${o.qty}</span>`:''}</div><ul>`;
 if(o.qty>1)h+=`<li class="${S.unit>o.qty?'ok':''}"><b>${say_(UI.bagged)}: ${Math.min(S.unit-1,o.qty)}/${o.qty}</b></li>`;
 if(o.noButter)h+=`<li class="no">${say_(UI.noButter)}</li>`;if(o.noPate)h+=`<li class="no">${say_(UI.noPate)}</li>`;
 Object.entries(o.req).forEach(([k,n])=>h+=`<li class="${(S.placed[k]||0)>=n?'ok':''}">${nm(k)}${n>1?' ×'+n:''}</li>`);
 h+=`<li class="${S.sauced?'ok':''}">${eng?SAUCES[o.sauce].en:say_(SAUCES[o.sauce])}</li>`;
 if(o.drink){const dn=DRINKS[o.drink].n;h+=`<li class="${S.drinkDone?'ok':''}">🥤 ${eng?dn.en:say_(dn)}${o.fruit?' ('+(eng?FRUITS[o.fruit].n.en:say_(FRUITS[o.fruit].n))+')':''}${o.strong?' <span class="no">'+say_(UI.strong)+'</span>':''}</li>`}
 h+='</ul>';if(o.noChili)h+=`<div class="note no">🌶 ${say_(UI.noChili)}</div>`;if(o.noCil)h+=`<div class="note no">🌿 ${eng?'NO CILANTRO!':say_(UI.noCil)}</div>`;if(o.noVeg)h+=`<div class="note no">🥬 ${say_(UI.noVeg)}</div>`;
 t.innerHTML=h}
/* ---------- bread board ---------- */
function resetBread(){$('breadImg').src='assets/bread_whole.webp';$('breadOver').style.opacity=0;$('pieces').innerHTML='';$('drizzle').style.opacity=0;$('breadBox').style.visibility='visible';$('breadBox').classList.remove('small');$('cupBox').style.display='none';$('qtyBadge').style.display='none'}
/* ---------- day flow ---------- */
function startDay(d){hideMenu();hideCard();stopTick();try{const ks=[];(DAYS[d].cust||[]).forEach(e=>{const v=CHARS[e.c]&&CHARS[e.c].voice;if(v)[0,1,2,3].forEach(i=>ks.push(v+'_'+i))});(STORY['intro'+d]||[]).forEach(l=>l.vo&&ks.push(l.vo));preloadVoices(ks);['dog','cat'].forEach(n=>{if(CBUF[n]===undefined)clip(n,null)});window._pimg=[];(DAYS[d].cust||[]).forEach(e=>{const ch=CHARS[e.c];if(ch&&ch.faces)new Set(Object.values(ch.faces)).forEach(f=>{const im=new Image();im.src='assets/c_'+e.c+'_'+f+'.webp';_pimg.push(im)})})}catch(e){}S={day:d,money:0,happy:0,served:0,lost:0,queue:[],cur:null,pending:[],spawnT:0,events:[],flags:{},mute:false,speaker:false,crying:false,power:false,rain:false,dogArm:0,results:{}};
 const D=DAYS[d];setMoney();buildTrays();resetBread();ticket();setScene(d);
 if(D.contest){vnPlay(STORY.intro7,()=>startContest());return}
 S.pending=D.cust.map((e,i)=>({id:e.c,gag:e.gag,o:e.o,idx:i}));S.events=(D.events||[]).map(e=>Object.assign({},e));
 const intro=STORY['intro'+d];setMusic('day');if(intro)vnPlay(intro,runDay);else runDay()}
function setScene(d){$('chloe').classList.remove('cry','hint');$('chloe').style.display=d>=2?'block':'none';$('chloe').src='assets/c_chloe_walker.webp';$('kiosk').style.display=d>=4?'block':'none';$('rainFx').classList.remove('on');$('powerFx').classList.remove('on');$('liveFx').classList.remove('on');$('bgStreet').style.filter=''}
function runDay(){S.started=true;banner(null);if(DAYS[S.day].rumor){toast(UI.rumor,3500)}startTick()}
let TICK=null;function startTick(){stopTick();TICK=setInterval(tick,250)}function stopTick(){clearInterval(TICK);TICK=null}
function present(){return S.queue.length+(S.cur?1:0)}
function tick(){if(S.paused||VN.on)return;const D=DAYS[S.day],dt=.25;
 if(S.endless){if(S.pending.length<1)S.pending.push(endlessCust());D.patience=Math.max(44,80-S.served*1.6);D.gap=Math.max(3.5,9-S.served*.25);D.queue=S.served>=10?3:2;
  if(S.lost>=3&&!S.ending){S.ending=true;S.pending=[];setTimeout(endEndless,1200);return}}
 // spawn
 S.spawnT-=dt;if(S.pending.length&&present()<D.queue&&(S.spawnT<=0||present()===0)){spawn(S.pending.shift());S.spawnT=S.rainBoost>0?2:D.gap;if(S.rainBoost>0)S.rainBoost--}
 if(!S.cur&&S.queue.length&&!S.busy)promote(S.queue.shift());
 // patience
 let mult=1;if(S.crying)mult*=has('rattle')?1.3:1.8;if(S.power)mult*=1.3;if(has('fan')&&!S.power)mult/=1.15;
 const all=(S.cur?[S.cur]:[]).concat(S.queue);
 all.forEach(c=>{if(c===S.cur&&(S.busy||['arrive','done'].includes(S.step)))return;c.p-=100/c.maxP*dt*mult*(c===S.cur?1:.4);
  if(c===S.cur&&c.p<28&&!c.warned){c.warned=1;face('angry');say(rnd([L('Lẹ lên em ơi!','Hurry up!'),L('Lâu quá à!','So slow!')]),2200);cv(c,'hurry');sfx.bad()}
  if(c.p<=0)leave(c)});
 drawQueue();if(S.cur){const b=$('pat').firstElementChild;b.style.width=Math.max(0,S.cur.p)+'%';b.style.background=S.cur.p>55?'#4caf50':S.cur.p>28?'#f2b21b':'#e04b3a'}
 // timed effects
 if(S.powerT>0){S.powerT-=dt;if(S.powerT<=0){S.power=false;$('powerFx').classList.remove('on');toast(L('Có điện lại rồi!','Power is back!'))}}
 if(S.rainT>0){S.rainT-=dt;if(S.rainT<=0){$('rainFx').classList.remove('on');$('bgStreet').style.filter=''}}
 if(!S.endless&&!S.pending.length&&!S.cur&&!S.queue.length&&!S.ending){S.ending=true;setTimeout(endDay,900)}}
function spawn(e){(window.__LOG=window.__LOG||[]).push('spawn '+e.id+' '+Math.round(performance.now()/1000));const c={id:e.id,gag:e.gag,idx:e.idx,order:makeOrder(e.o,e.id),p:100,mistakes:0};const D=DAYS[S.day];
 c.maxP=(D.patience+(c.order.qty-1)*30+(c.order.drink?22:0))*(c.gag==='inlaw'?1.3:c.gag&&c.gag!=='usual'?1.35:1);
 S.events.filter(ev=>ev.onCust===e.idx&&!ev.done).forEach(ev=>{ev.done=1;triggerEvent(ev)});
 S.queue.push(c);if(!S.cur&&!S.busy)promote(S.queue.shift());else sfx.pop()}
function drawQueue(){const q=$('queue');if(!S.queue.length){q.innerHTML='';return}
 q.innerHTML=`<div class="qh">${say_(UI.waiting)}</div>`+S.queue.map(c=>`<div class="qc"><img src="assets/g_${c.id==='co_ba'?'co_ba':c.id}.webp" alt=""><div><b>${CHARS[c.id].name}</b><i><u style="width:${Math.max(0,c.p)}%;background:${c.p>55?'#4caf50':c.p>28?'#f2b21b':'#e04b3a'}"></u></i></div></div>`).join('')}
function promote(c){(window.__LOG=window.__LOG||[]).push('promote '+c.id+' '+Math.round(performance.now()/1000)+' p'+Math.round(c.p));S.cur=c;S.unit=1;S.placed={};S.sauced=false;S.drinkDone=false;S.step='arrive';S.busy=true;S.asked=false;resetBread();
 const w=$('custWrap');w.className='abs';face('front');ticket();$('pat').style.display='block';$('patL').style.display='block';
 requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.add('in')));
 c.hi=greet(c);setTimeout(()=>{if(S.cur!==c)return;say(c.hi);cv(c,'arrive');if(c.gag==='live')liveOn();
  if(c.gag==='inlaw')return inlawIntro(c);
  const go=ms=>setTimeout(()=>{if(S.cur===c){S.busy=false;step('slice')}},ms);
  if(c.gag==='chotdon'){liveOn();return setTimeout(()=>{if(S.cur!==c)return;face('happy');say(L('Ối, cả nhà chốt đơn rồi! Làm 2 ổ nha em! Chốt! Chốt!','Oh, the fam is ordering! Make it 2! Sold! Sold!'),2400);const o=c.order;o.total=o.total/o.qty*2;o.qty=2;ticket();huySay(L('Hả? Ai chốt?','Huh? Who ordered?'),'shocked');go(2600)},1900)}
  if(c.gag==='genz'){return setTimeout(()=>{if(S.cur!==c)return;huySay(L('…Hả? Em nói tiếng gì vậy?','…Huh? What language is that?'),'shocked');toast(L('📖 Na dịch: "khum" = không · "ét o ét" = gấp lắm · "chằm zn" = buồn xỉu','📖 Na translates: "khum" = no · "ét o ét" = SOS, hurry · "chằm zn" = super sad'));go(2600)},1900)}
  if(c.gag==='coach'){return setTimeout(()=>{if(S.cur!==c)return;face('happy');say(L('À mà em có muốn mua khóa học "Bán bánh mì 0 đồng ra tỷ phú" không? Có 20 nghìn thôi!','Hey, want my course "Bánh mì to billionaire from zero"? Only 20k!'),3000);choice(L('Mua khóa học (−20k)','Buy the course (−20k)'),L('Thôi khỏi anh','No thanks'),()=>{S.money=Math.max(0,S.money-20000);setMoney();face('happy');say(L('Bài học số 1: đừng mua khóa học của người lạ. Cảm ơn em nha!','Lesson one: never buy a course from strangers. Thanks!'),2600);huySay(L('…Mất 20 nghìn để học câu đó?!','…I paid 20k for THAT?!'),'shocked');go(2600)},()=>{face('shocked');say(L('Từ chối dứt khoát! Tư duy tốt, em out trình anh rồi.','Firm no! Great mindset, you out-leveled me.'),2400);go(2400)})},1900)}
  if(c.gag==='shipper'){sfx.pop();toast(L('📱 Reng reng… reng reng…','📱 Ring ring… ring ring…'))}
  if(c.gag==='teacher_in')return teacherIntro(c);
  setTimeout(()=>{if(S.cur===c){S.busy=false;step('slice')}},700)},850)}
function greet(c){const o=c.order,line=orderLine(c),lc=line.charAt(0).toLowerCase()+line.slice(1);const G={
 co_ba:L(`Con ơi, cho cô ${line}. Má con đâu rồi?`,`Sweetie, ${lc} for me. Where's your mom?`),
 anh_tuan:L(`Em ơi ${line}, KHÔNG ỚT nha! Anh trễ làm rồi!`,`${line}, NO CHILI! I'm late!`),
 be_ti:L(`Chú ơi! ${line}, cay xé lưỡi luôn! Con trả xu nha!`,`Mister! ${line}, super spicy! Paying in coins!`),
 chu_tu:c.gag==='usual_first'?L('Như mọi khi nha con! …À con mới hả? Chả lụa với ly cà phê sữa đá.','The usual! …Oh you\'re new? Pork roll and an iced coffee.'):L('Như mọi khi nha con!','The usual, kid!'),
 chi_linh:L(`Em ơi ${line}! Nhanh nhanh, khách hối rồi!`,`${line}! Quick, my customer is waiting!`),
 mai:L(`Hello cả nhà! Hôm nay Mai review ${line} nè!`,`Hi everyone! Today Mai reviews ${lc}!`),
 coach:L(`Em ơi, ${line}. Anh đang chạy deadline làm giàu, em làm lẹ giùm anh!`,`${line}, please. I'm on a get-rich deadline, hurry!`),
 chot:L(`Cả nhà ơi, chị đang ở tiệm bánh mì A Huy nè! Em ơi, ${line}!`,`Hi fam, I'm at A Huy's stall! ${line}, please!`),
 tu_mukbang:L(`Quẹo lựa bà con ơi! Hôm nay anh Tư mukbang ${line} ở Long Khánh nè!`,`Step right up, folks! Today Anh Tư mukbangs ${lc} in Long Khánh!`),
 su_genz:L(`Anh ơi, ${line}, khum ớt nha. Ét o ét, em trễ học rồi, hông thôi em chằm zn á!`,`${line}, "khum" chili. SOS, I'm late for class or I'll be "chằm zn"!`),
 shipper:L(`Anh ơi ${line}! Lẹ giùm em, khách em gọi ba cuộc rồi!`,`${line}! Hurry, my customer called me three times!`),
 bao:L(`Anh ơi ${line}, xịt nước mắm cho viral nha!`,`${line}, with fish sauce for the views!`),
 van:L(`Trời ơi giống má con quá! Cho cô ${line}.`,`You look just like your mom! ${line} please.`),
 ba_sau:L(`Bà lấy ${line}. Mà mua giùm bà tờ vé số nghen!`,`${line} for me. And buy a lottery ticket, dear!`),
 tom:L('Hello! Special bánh mì please! NO cilantro! And passion fruit juice!','Hello! Special bánh mì please! NO cilantro! And passion fruit juice!'),
 co_hanh:L(`Cô lấy ${line}. Cô vô lớp gấp.`,`${line} please. I'm late for class.`),
 ong_nam:L(`Hồi xưa bánh mì có 500 đồng à! Cho ông ${line}.`,`Back in my day bánh mì cost 500đ! ${line} please.`),
 chi_thu:L(`Cho chị ${line}… cà phê ĐẬM, thật đậm nha em…`,`${line}… make the coffee STRONG, really strong…`),
 minh:L(`Anh ơi ${line}, THÊM THỊT! Gấp đôi!`,`${line}, EXTRA MEAT! Double!`),
 be_bong:L(`Chú ơi, con chỉ ăn trứng thôi! Không rau!`,`Mister, I only eat egg! No veggies!`),
 anh_son:L(`Chú em ơi, ${line} cho anh em công trình!`,`Hey buddy, ${line} for my crew!`),
 co_dieu:L(`Cô ăn kiêng nha: ${line}, KHÔNG bơ, KHÔNG pa-tê!`,`I'm on a diet: ${lc}, NO butter, NO pâté!`),
 ong_thanh:L(`Ui chao, ${line}. Nhiều ớt, nước mắm nghe con.`,`Oh my, ${lc}. Extra chili, fish sauce.`),
 };const g=G[c.id]||L(`Cho ${line}!`,`${line} please!`);const fix=t=>typeof t==='string'?t.split(line).map((x,i,arr)=>i<arr.length-1&&!/(^|[.!?:]\s*)$/.test(x)?x+lc:(i<arr.length-1?x+line:x)).join(''):t;return typeof g==='object'?{vi:fix(g.vi),en:fix(g.en)}:fix(g)}
function leave(c){(window.__LOG=window.__LOG||[]).push('leave '+c.id+(c===S.cur?' cur':' wait'));if(c===S.cur){S.step='done';banner(null);hint([]);setCarry(null);setPose('open');face('angry');say(L('Thôi khỏi! Đi tiệm khác!','Forget it, I\'m going elsewhere!'));cv(c,'leave');huySay(L('Thôi, coi như đã bán… trong tâm tưởng.','Well… sold in spirit.'),'shocked');sfx.bad();S.lost++;liveOff();S.busy=true;setTimeout(()=>exitCust(),1900)}
 else{S.queue=S.queue.filter(x=>x!==c);S.lost++;if(c.gag==='teacher'){S.pending.unshift({id:'co_hanh',gag:'teacher_in',o:{r:'op_la',drink:'cafe'},idx:99});S.spawnT=0}toast(L(`${CHARS[c.id].name} chờ lâu quá, bỏ đi rồi!`,`${CHARS[c.id].name} gave up waiting!`));sfx.bad();drawQueue()}}
function exitCust(){$('custWrap').classList.add('out');$('bubble').classList.remove('show');setTimeout(()=>{S.cur=null;S.busy=false;S.step='idle';ticket();$('pat').style.display='none';$('patL').style.display='none';resetBread();setCarry(null);setPose('open');hint([]);$('choices').innerHTML='';$('skipBtn').style.display='none';$('dItems').style.display='none';$('trays').style.display='flex'},950)}
function mistake(why){const c=S.cur;c.mistakes++;c.p=Math.max(1,c.p-15);face('shocked');say(why||L('Ủa? Đâu có kêu cái đó!','Huh? I didn\'t order that!'),1800);cv(c,'wrong');huySay(L('Ơ chết, tay nó tự bốc á!','Oops… my hand did it!'),'shocked','huy_1');meo();sfx.bad();if(c.gag==='live')liveComment(-1);
 if(DAYS[S.day].rumor){setTimeout(()=>{if(S.cur===c){c.rumorLeft=1;leave(c)}},1100);return true}
 setTimeout(()=>{if(S.cur===c&&!['done'].includes(S.step))face(c.p<28?'angry':'front')},900);return false}
/* ---------- steps ---------- */
const STEP_UI={slice:'slice',butter:'butter',pate:'pate',fill:'fill',sauce:'sauce',wrap:'wrap',give:'give'};
function step(s){ghostStop();S.step=s;S.prog=0;S.armed=false;setTimeout(tutGhost,450);if(STEP_UI[s])banner(UI[STEP_UI[s]]);setPose(s==='slice'?'bread_knife':'open');setCarry(null);$('skipBtn').style.display='none';
 const o=S.cur.order;
 if(s==='slice'||s==='wrap'||s==='give')hint([$('breadBox')].concat(s==='give'&&o.drink?[$('cupBox')]:[]));
 if(s==='butter'||s==='pate'){hint([$(s==='butter'?'butterBowl':'pateBowl')]);if(S.day>=5){const b=$('skipBtn');b.textContent=say_(s==='butter'?UI.noButter:UI.noPate);b.style.display='block'}}
 if(s==='fill'){hintTrays();if(S.dogArm>0)S.dogWatch=true}
 if(s==='sauce')hint([$('b_'+o.sauce)]);
 if(s==='drink')startDrink()}
function hintTrays(){const o=S.cur.order;hint(Object.entries(o.req).filter(([k,n])=>(S.placed[k]||0)<n).map(([k])=>document.querySelector(`.tray[data-k="${k}"]`)))}
$('skipBtn').onpointerdown=e=>{e.stopPropagation();const s=S.step,o=S.cur.order;$('skipBtn').style.display='none';sfx.pop();
 if((s==='butter'&&!o.noButter)||(s==='pate'&&!o.noPate)){if(mistake(L('Ủa? Sao không có bơ/pa-tê vậy?','Hey, where\'s the butter/pâté?')))return}
 step(s==='butter'?'pate':'fill')};
/* ---------- input ---------- */
let down=false,lastX=0,minX=0,maxX=0,lastY=0,stirA=null;
function toP(e){const s=stage.getBoundingClientRect();return{x:(e.clientX-s.left)/SC,y:(e.clientY-s.top)/SC}}
stage.addEventListener('pointermove',e=>{P=toP(e);drawHand();if(!down||S.busy)return;onDrag()});
stage.addEventListener('pointerdown',e=>{ghostStop();P=toP(e);drawHand();ac();if(e.target.closest('button,.coin,.ditem,#chloe'))return;if(VN.on){vnClick();return}
 if(S.dogRun&&inR(P,R($('dog')),30)){catchDog();return}
 const ch=$('chloe');if(S.started&&ch.style.display!=='none'&&inR(P,R(ch),S.crying?40:0)&&(S.crying||!S.cur||['arrive','done','idle'].includes(S.step))){chloeTap();return}
 const mo=$('mochi');if(S.started&&!S.crying&&mo.offsetParent&&inR(P,R(mo),0)&&!(S.cur&&['fill','sauce'].includes(S.step))){meo();return}
 if(S.busy||!S.cur)return;down=true;try{stage.setPointerCapture(e.pointerId)}catch(_){}lastX=minX=maxX=P.x;lastY=P.y;stirA=null;onDown()});
const up=e=>{if(tutOn()){clearTimeout(S.tutT);S.tutT=setTimeout(()=>{if(!down)tutGhost()},1500)}if(!down)return;down=false;P=toP(e);onUp()};stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
const BR=()=>R($('breadBox'));
function onDown(){const s=S.step,o=S.cur.order;
 if((s==='butter'||s==='pate')&&!S.armed){const bowl=$(s==='butter'?'butterBowl':'pateBowl');if(inR(P,R(bowl),10)){
   if((s==='butter'&&o.noButter)||(s==='pate'&&o.noPate)){if(mistake(L('Trời ơi! Cô ăn kiêng mà!','Oh no! I\'m on a diet!')))return}
   S.armed=true;setPose('spread_knife');setCarry({type:'spread',src:s==='butter'?'pieces_butter_mayo':'pieces_pate'});sfx.plop();hint([$('breadBox')])}}
 if(s==='fill'){const tr=[...document.querySelectorAll('.tray')].find(el=>inR(P,R(el)));if(tr&&!tr.classList.contains('locked')){const k=tr.dataset.k;setPose('pinch');setCarry({type:'piece',k,src:PIECE[k],rot:Math.random()*40-20});sfx.pop()}}
 if(s==='sauce'&&!S.armed){const b=[...document.querySelectorAll('.bottle')].find(el=>inR(P,R(el),10));if(b){S.armed=b.dataset.s;setPose('fist');setCarry({type:'bottle',src:b.querySelector('img').getAttribute('src').slice(7,-5)});sfx.pop();hint([$('breadBox')])}}
 if(s==='wrap'&&inR(P,BR()))wrap();
 if(s==='give'&&(inR(P,BR())||inR(P,R($('cupBox'))))){setPose('fist');setCarry({type:'bread',src:'bread_wrapped'});$('breadBox').style.visibility='hidden';$('cupBox').style.visibility='hidden';sfx.pop()}
 if(s==='drink')drinkDown()}
function onDrag(){const s=S.step,br=BR(),over=inR(P,br,20);
 if(s==='slice'&&over){minX=Math.min(minX,P.x);maxX=Math.max(maxX,P.x);if(Math.random()<.15)tone(500+Math.random()*200,.04,'triangle',.05);
  if(maxX-minX>br.w*(has('knife')?.35:.62)){$('breadImg').src='assets/bread_sliced.webp';sfx.swish();down=false;setTimeout(()=>step('butter'),250)}}
 if((s==='butter'||s==='pate')&&S.armed&&over){S.prog=Math.min(1,S.prog+Math.abs(P.x-lastX)/(has('spread')?730:1100));const ov=$('breadOver');ov.src='assets/'+(s==='butter'?'bread_butter':'bread_butter_pate')+'.webp';ov.style.opacity=S.prog;if(Math.random()<.1)tone(260+S.prog*300,.05,'triangle',.05);
  if(S.prog>=1){$('breadImg').src=ov.src;ov.style.opacity=0;sfx.ding();down=false;setCarry(null);setTimeout(()=>step(s==='butter'?'pate':'fill'),250)}}
 if(s==='drink')drinkDrag();
 lastX=P.x;lastY=P.y}
setInterval(()=>{if(down&&S.cur&&!S.busy){if(S.step==='sauce'&&S.armed&&inR(P,BR(),20))sauceTick();if(S.step==='drink'&&S.pouring)pourTick()}},40);
function sauceTick(){S.prog=Math.min(1,S.prog+.025);const d=$('drizzle');d.src='assets/sauces_'+{soy:'soy',fish:'fish_sauce',chili:'chili'}[S.armed]+'_drizzle.webp';d.style.opacity=S.prog;if(Math.random()<.2)tone(180+Math.random()*60,.05,'sawtooth',.03);if(S.prog>=1){down=false;finishSauce()}}
function onUp(){const s=S.step;
 if(s==='fill'&&carry&&carry.type==='piece'){const k=carry.k,br=BR();if(inR(P,br,10))dropPiece(k,(P.x-br.x)/br.w);else{fallPiece();huySay(L('Rớt rồi…','Dropped it…'),'shocked')}setCarry(null);setPose('open')}
 if(s==='give'&&carry&&carry.type==='bread'){if(P.y<500)serve();else{$('breadBox').style.visibility='visible';$('cupBox').style.visibility='visible';setCarry(null);setPose('open')}}
 if(s==='drink')drinkUp()}
function fallPiece(){const c=$('carry'),img=c.cloneNode();img.removeAttribute('id');img.style.cssText=c.style.cssText;img.className='abs';stage.appendChild(img);requestAnimationFrame(()=>{img.classList.add('fall');img.style.transform+=' translateY(400px) rotate(120deg)'});setTimeout(()=>img.remove(),700);sfx.bad()}
function dropPiece(k,fx){const c=S.cur,o=c.order,need=o.req[k]||0,have=S.placed[k]||0;
 if(have>=need){fallPiece();
  if(k==='chili'&&o.noChili)return mistake(L('ANH NÓI KHÔNG ỚT MÀ!!!','I SAID NO CHILI!!!'));
  if(k==='cilantro'&&o.noCil)return mistake(L('Oh no! Cilantro!!','Oh no! Cilantro!!'));
  if(o.noVeg&&VEG.includes(k)){face('shocked');return mistake(L('Con không ăn rau đâu!!','I don\'t eat veggies!!'))}
  return mistake()}
 const im=document.createElement('img');im.src='assets/'+PIECE[k]+'.webp';const w=k==='egg'?150:110;im.style.width=w+'px';
 im.style.left=(Math.min(.78,Math.max(.22,fx))*520-w/2)+'px';im.style.top=((.2+Math.random()*.16)*280)+'px';im.style.transform=`rotate(${Math.random()*50-25}deg)`;im.dataset.k=k;$('pieces').appendChild(im);sfx.plop();
 S.placed[k]=have+1;ticket();hintTrays();
 if(S.dogWatch&&Object.values(S.placed).reduce((a,b)=>a+b,0)===2){S.dogWatch=false;S.dogArm--;setTimeout(dogRun,800)}
 checkFill()}
function checkFill(){const o=S.cur.order;if(Object.entries(o.req).every(([k,n])=>(S.placed[k]||0)>=n)&&!S.dogRun)setTimeout(()=>{if(S.step==='fill'&&!S.dogRun)step('sauce')},350)}
function finishSauce(){const o=S.cur.order;setCarry(null);setPose('open');S.sauced=true;ticket();const wrong=S.armed!==o.sauce;S.armed=false;
 if(wrong){if(mistake(o.sauce==='fish'?L('Nước mắm mà em!','I said fish sauce!'):L('Ủa, sai chai rồi!','Wrong bottle!')))return}else sfx.ding();setTimeout(()=>step('wrap'),400)}
function wrap(){S.busy=true;hint([]);tone(300,.25,'triangle',.08,200);$('pieces').innerHTML='';$('drizzle').style.opacity=0;$('breadImg').src='assets/bread_wrapped.webp';
 const o=S.cur.order;setTimeout(()=>{S.busy=false;if(!S.cur)return;
  if(S.unit<o.qty){S.unit++;if(S.cur.gag==='change'&&S.unit===2)return orderChange();bagOne();return}
  S.unit=o.qty+1;ticket();if(o.qty>1){$('qtyBadge').textContent='×'+o.qty;$('qtyBadge').style.display='block'}
  if(o.drink){step('drink')}else step('give')},400)}
function bagOne(){const b=$('bagFly');b.style.display='block';b.classList.remove('go');void b.offsetWidth;b.classList.add('go');sfx.pop();setTimeout(()=>b.style.display='none',600);
 S.placed={};S.sauced=false;ticket();resetBread();toast(L(`Ổ thứ ${S.unit}/${S.cur.order.qty}`,`Loaf ${S.unit}/${S.cur.order.qty}`),1200);step('slice')}
function orderChange(){S.busy=true;say(L('À khoan! Mấy ổ còn lại đổi qua xíu mại nha em!','Wait! Make the rest meatball bánh mì!'),2600);cv(S.cur,'hurry');huySay(L('Hả?!','What?!'),'shocked');
 setTimeout(()=>{const c=S.cur;if(!c)return;const nr=RECIPES.xiu_mai;c.order.req=Object.assign({},nr.req);c.order.name=L('Chả lụa → xíu mại','Pork roll → meatball');S.busy=false;bagOne()},2200)}
/* ---------- drinks ---------- */
const DLAYER={coffee:'#3b2010'};
function startDrink(){const o=S.cur.order,D=DRINKS[o.drink];banner(D.steps[0].lab);S.dStep=0;S.dLayers=[];S.dLevel=0;S.dTaps=0;S.dIce=0;S.dGarn=[];S.stir=0;S.phin=0;
 $('breadBox').classList.add('small');$('cupBox').style.display='block';$('cupBox').style.visibility='visible';$('trays').style.display='none';buildDItems();drawCup();drinkStepUI()}
function buildDItems(){const o=S.cur.order,D=DRINKS[o.drink];const items=[];D.steps.forEach(s=>{if(s.item&&!items.includes(s.item))items.push(s.item);if(s.t==='fruit')Object.keys(FRUITS).forEach(f=>items.push(f))});
 if(!items.includes('ice'))items.push('ice');const extra=['milk','tea','peach','water'].filter(x=>!items.includes(x)).slice(0,2);extra.forEach(x=>items.push(x));
 items.sort(()=>Math.random()-.5);
 $('dItems').innerHTML=items.map(k=>`<div class="ditem" data-k="${k}"><img src="assets/d_${k}.webp" alt=""><span class="lbl">${say_(DITEM[k])}</span></div>`).join('');$('dItems').style.display='flex';
 document.querySelectorAll('.ditem').forEach(el=>{el.onpointerdown=e=>{e.stopPropagation();P=toP(e);drawHand();if(S.busy)return;ditemDown(el.dataset.k,el,e)}})}
function curDStep(){return DRINKS[S.cur.order.drink].steps[S.dStep]}
function drinkStepUI(){const s=curDStep();if(!s)return;setTimeout(tutGhost,350);banner(s.lab);const els=[...document.querySelectorAll('.ditem')];
 if(s.t==='fruit')hint(els.filter(e=>FRUITS[e.dataset.k]));else if(s.item)hint(els.filter(e=>e.dataset.k===s.item));else hint([$('cupBox')]);
 $('band').style.display=s.t==='hold'?'block':'none';if(s.t==='hold'){const [lo,hi]=bandFor(s);$('band').style.bottom=(30+lo*250)+'px';$('band').style.height=((hi-lo)*250)+'px'}}
function bandFor(s){let [lo,hi]=s.band;if(S.cur.order.strong&&s.item==='kettle'){lo=.40;hi=.52}if(has('pour')){lo-=.04;hi+=.04}return[lo,hi]}
function ditemDown(k,el){const s=curDStep();if(!s)return;
 if(s.t==='fruit'){if(!FRUITS[k]){return dWrong()}if(k!==S.cur.order.fruit){dWrong(L('Sai trái rồi em!','Wrong fruit!'));return}S.dGarn.push(k);sfx.plop();drawCup();return nextD()}
 if(s.item!==k){if(['stir','shake'].includes(s.t))return;return dWrong()}
 if(s.t==='tap'){S.dTaps++;if(k==='ice'){S.dIce++;sfx.ice()}else if(k==='phin'){S.phin=1;sfx.plop()}else{S.dGarn.push(k);sfx.plop()}setPose('pinch');setCarry({type:'ditem',src:'d_'+k});setTimeout(()=>{setCarry(null);setPose('open')},250);drawCup();if(S.dTaps>=s.n){S.dTaps=0;nextD()}}
 if(s.t==='hold'){S.pouring=k;down=true;setPose('fist');setCarry({type:'ditem',src:'d_'+k,tilt:1});S.dLayerStart=S.dLevel}}
function dWrong(msg){if(mistake(msg||L('Ủa, bỏ cái gì vậy em?','Hey, what are you putting in?')))return}
function pourTick(){const s=curDStep();if(!s||s.t!=='hold')return;S.dLevel=Math.min(1,S.dLevel+.012);sfx.pour();const col=s.layer==='fruit'?FRUITS[S.cur.order.fruit].c:s.layer;S.dLayers[S.dStep]={from:S.dLayerStart,to:S.dLevel,c:col};drawCup()}
function drinkDown(){}
function drinkDrag(){const s=curDStep();if(!s)return;const cb=R($('cupBox'));if(!inR(P,cb,60))return;
 if(s.t==='stir'){const cx=cb.x+cb.w/2,cy=cb.y+cb.h/2,a=Math.atan2(P.y-cy,P.x-cx);if(stirA!==null){let d=a-stirA;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;S.stir+=Math.abs(d)}stirA=a;$('cupSvg').style.transform=`rotate(${Math.sin(S.stir*3)*3}deg)`;if(Math.random()<.15)tone(1500,.03,'triangle',.03);if(S.stir>Math.PI*6){S.stir=0;$('cupSvg').style.transform='';sfx.ding();down=false;nextD()}}
 if(s.t==='shake'){S.stir+=Math.abs(P.y-lastY);$('cupSvg').style.transform=`translateY(${Math.sin(S.stir/20)*14}px)`;if(Math.random()<.1)sfx.ice();if(S.stir>1600){S.stir=0;$('cupSvg').style.transform='';sfx.ding();down=false;nextD()}}}
function drinkUp(){if(!S.pouring)return;const s=curDStep();S.pouring=null;setCarry(null);setPose('open');const [lo,hi]=bandFor(s);
 if(S.dLevel<lo)return toast(L('Chưa tới vạch, rót thêm!','Not enough yet, pour more!'),1200);
 if(S.dLevel>hi){S.dLevel=hi;S.dLayers[S.dStep].to=hi;drawCup();if(dWrong(s.item==='kettle'&&S.cur.order.strong?L('Nhạt quá em ơi…','Too weak…'):L('Tràn rồi kìa!','It\'s overflowing!')))return}else sfx.ding();
 nextD()}
function nextD(){S.dStep++;const D=DRINKS[S.cur.order.drink];if(S.dStep>=D.steps.length){S.drinkDone=true;ticket();drawCup(true);$('band').style.display='none';hint([]);sfx.ding();setTimeout(()=>{$('dItems').style.display='none';$('trays').style.display='flex';$('breadBox').classList.remove('small');step('give')},450)}else drinkStepUI()}
function drawCup(done){const g=$('cupLiq');let h='',top='';const H=250,B=300;S.dLayers.forEach(l=>{if(!l)return;const y1=B-l.to*H,y0=B-l.from*H;h+=`<rect x="22" y="${y1}" width="136" height="${Math.max(0,y0-y1)}" fill="${l.c}" opacity=".92"/>`});
 for(let i=0;i<S.dIce;i++)h+=`<rect x="${36+i*40}" y="${B-Math.max(.25,S.dLevel)*H+10+i*14}" width="34" height="30" rx="6" fill="#e9f7ff" stroke="#9fc7da" stroke-width="3" opacity=".9"/>`;
 S.dGarn.forEach((k,i)=>{h+=`<image href="assets/d_${k}.webp" x="${30+(i%3)*42}" y="${B-Math.max(.3,S.dLevel)*H+30+Math.floor(i/3)*30}" width="${k==='lemongrass'?40:46}" height="46"/>`});
 if(S.phin&&S.dStep<=1)top+=`<image href="assets/d_phin.webp" x="30" y="-60" width="120" height="130"/>`;
 if(done)top+=`<rect x="112" y="-40" width="12" height="200" rx="5" fill="#e8434f" stroke="#4a2a12" stroke-width="3"/>`;g.innerHTML=h;$('cupTop').innerHTML=top}
/* ---------- dog ---------- */
function dogRun(){if(S.step!=='fill')return;const d=$('dog'),lt=$('dogLoot');
 if(has('bone')){d.style.display='block';sfx.bark();huySay(L('Kẹo! Ăn xương đi nè!','Kẹo! Have a bone!'),'happy');let t0=performance.now();(function fr(now){const u=(now-t0)/2400;if(u>=1){d.style.display='none';return}d.style.left=(1650-1950*u)+'px';d.style.top=(470-Math.sin(u*Math.PI*3)**2*60)+'px';requestAnimationFrame(fr)})(t0);return}
 const pcs=[...$('pieces').children];const tgt=pcs[pcs.length-1];if(!tgt)return;
 S.dogRun=true;S.stolen=tgt;tgt.style.visibility='hidden';const k=tgt.dataset.k;S.placed[k]=Math.max(0,(S.placed[k]||1)-1);ticket();hintTrays();
 lt.src=tgt.src;lt.style.display='block';d.style.display='block';sfx.bark();huySay(L('KẸO! Trả bánh mì đây!','KẸO! Give it back!'),'angry','huy_2');face('shocked');say(L('Ơ! Con chó!','Hey! A dog!'),1500);
 const t0=performance.now();(function fr(now){if(!S.dogRun)return;const u=(now-t0)/2600;if(u>=1){d.style.display='none';lt.style.display='none';S.dogRun=false;S.dogStolen=true;tgt.remove();huySay(L('Tiền chả lụa tao trừ vào tiền xương của mày!','That\'s coming out of your bone budget!'),'angry');face('front');checkFill();return}
  const dx=1650-1950*u,dy=470-Math.sin(u*Math.PI*3)**2*90;d.style.left=dx+'px';d.style.top=dy+'px';lt.style.left=(dx-10)+'px';lt.style.top=(dy+48)+'px';lt.style.transform=`rotate(${Math.sin(now/90)*15-20}deg)`;requestAnimationFrame(fr)})(t0)}
function catchDog(){S.dogRun=false;$('dog').style.display='none';$('dogLoot').style.display='none';if(S.stolen){S.stolen.style.visibility='visible';const k=S.stolen.dataset.k;S.placed[k]=(S.placed[k]||0)+1;ticket();hintTrays()}sfx.ding();huySay(L('Hehe, hụt rồi Kẹo!','Ha! Missed me, Kẹo!'),'happy');face('happy');setTimeout(()=>face('front'),900);checkFill()}
/* ---------- events ---------- */
function triggerEvent(ev){const t=ev.type;
 if(t==='dog')S.dogArm++;
 if(t==='doggang'){S.dogArm+=3;toast(L('Kẹo dẫn cả bầy chó tới!','Kẹo brought the whole gang!'))}
 if(t==='chloe')setTimeout(chloeCry,4000);
 if(t==='rain'){S.rainT=45;S.rainBoost=2;$('rainFx').classList.add('on');$('bgStreet').style.filter='saturate(.7) brightness(.8)';toast(UI.rain);tone(120,1.5,'sawtooth',.03)}
 if(t==='power'){setTimeout(()=>{S.power=true;S.powerT=30;$('powerFx').classList.add('on');toast(UI.power);sfx.bad()},3000)}
 if(t==='speaker'){S.speaker=true;S.mute=true;$('speakerFx').classList.add('on');toast(UI.speakerOn)}}
function chloeCry(){if(!S.started||S.crying)return;S.crying=true;S.calm=has('rattle')?1:3;const c=$('chloe');c.src='assets/c_chloe_pout.webp';c.classList.add('cry','hint');voice('chloe_1');toast(UI.chloeCry,2500)}
function chloeTap(){if(!S.crying){sfx.pop();voice('chloe_0');return}S.calm--;sfx.pop();if(S.calm<=0){S.crying=false;const c=$('chloe');c.src='assets/c_chloe_walker.webp';c.classList.remove('cry','hint');voice('chloe_0');huySay(L('Ngoan nha con!','Good girl!'),'happy')}};
/* ---------- livestream ---------- */
const LIVE_GOOD=['Ngon quá 😍','Ổ này bao nhiêu ạ?','Anh chủ dễ thương ghê','Mai ghé liền!','10 điểm!','Long Khánh có tiệm này hả?','Mãi keo 🔥','Tuyệt đối điện ảnh!','Đỉnh nóc kịch trần!','Hoá điênggg 😭','Vuýp vuýp!','Cơm nước gì chưa anh chủ?','Chốt 1 ổ ship Biên Hoà!'],LIVE_BAD=['Ủa sai rồi kìa 😂','Anh chủ run tay kìa','Chậm quá à','Tiệm bên kia nhanh hơn','haha bốc nhầm','Ô dề quá 😂','U là trời, sai nữa','Hướng nội hết phần đời còn lại luôn','Anh chủ báo thủ ghê'];
function liveOn(){$('liveFx').classList.add('on');$('liveChat').innerHTML='';S.liveT=setInterval(()=>liveComment(0),1800)}
function liveOff(){clearInterval(S.liveT);$('liveFx').classList.remove('on')}
function liveComment(v){const el=document.createElement('div');el.textContent=(v<0?rnd(LIVE_BAD):rnd(LIVE_GOOD));if(v<0)el.className='bad';const box=$('liveChat');box.appendChild(el);while(box.children.length>5)box.firstChild.remove();$('liveViews').textContent='👁 '+(S.day>=5?300+Math.floor(Math.random()*40):3+Math.floor(Math.random()*4))}
/* ---------- scripted gags ---------- */
function choice(a,b,fa,fb){$('choices').innerHTML=`<button class="big alt" id="chA">${say_(a)}</button><button class="big" id="chB">${say_(b)}</button>`;$('chA').onclick=()=>{$('choices').innerHTML='';fa()};$('chB').onclick=()=>{$('choices').innerHTML='';fb()}}
function inlawIntro(c){S.busy=true;vnPlay([
 {who:'na',f:'blouse_shocked',t:L('Ba! Ba vô hồi nào vậy?','Dad! When did you arrive?'),vo:'na_23'},
 {who:'ong_thanh',f:'skeptical',t:L('Ba vô coi thằng rể bán buôn răng. Làm cho ba một ổ coi.','I came to see how my son-in-law runs things. Make me one.'),vo:'ong_thanh_0'},
 {who:'huy',f:'shocked',t:L('Dạ ba! Có liền, có liền!','Y… yes sir! Coming right up!'),vo:'huy_3'}],()=>{S.busy=false;if(S.cur===c){face('angry');say(c.hi,3000);step('slice')}})}
function teacherIntro(c){S.busy=true;vnPlay([{who:'co_hanh',f:'strict',t:L('Bé Tí! Giờ này mà còn ở đây hả? Mai lên văn phòng gặp cô!','Bé Tí! Why aren\'t you in class? Come see me tomorrow!'),vo:'co_hanh_0'},{who:'huy',f:'shocked',t:L('(Bé Tí chạy mất dép…)','(Bé Tí runs off so fast he loses a sandal…)')},{who:'co_hanh',f:'smile',t:L('…Mà thôi, tiện thì cô lấy một ổ luôn.','…Well, since I\'m here, I\'ll have one too.'),vo:'co_hanh_5'}],()=>{S.busy=false;if(S.cur===c){face('front');step('slice')}})}
/* ---------- serve ---------- */
function serve(){const c=S.cur,o=c.order;S.step='done';S.busy=true;banner(null);hint([]);setCarry(null);setPose('thumbs_up');sfx.ding();huySay(L('Bánh mì ra lò rồi đây!','Fresh out the oven!'),'happy','huy_0');setTimeout(()=>setPose('open'),800);liveOff();
 let pay=o.total,tip=c.p>55?5000:c.p>28?2000:0,happy=c.mistakes===0;if(has('speaker'))tip*=1.2;if(has('led'))tip*=1.3;if(c.gag==='live'&&happy)tip*=2;
 const finish=(ms=0,eatLine)=>{S.money+=pay+tip;S.served++;if(happy)S.happy++;setMoney();coinPop(pay+tip);
  setTimeout(()=>{face('eating');say(eatLine||(happy?L('Ngon quá trời!','So delicious!'):L('Cũng được…','It\'s okay…')),2200);if(happy)cv(c,'happy');setTimeout(()=>{S.busy=false;exitCust()},2300)},ms)};
 const g=c.gag;
 if(g==='mukbang'&&happy){tip+=5000;return finish(0,L('Ba ổ một lần… ngon bá cháy! Năm sao Đồng Nai luôn!','Three in one go… insanely good! Five Đồng Nai stars!'))}
 if(g==='shipper'&&happy){tip+=5000;return finish(0,L('Năm sao cho anh! Em bay đây!','Five stars for you! Gotta fly!'))}
 if(g==='coach'&&happy)return finish(0,L('Bánh mì này… tư duy triệu đô! Anh sẽ làm khóa học về nó.','This bánh mì… million-dollar mindset! I\'ll make a course about it.'));
 if(g==='genz'&&happy)return finish(0,L('Tuyệt đối điện ảnh! Mãi keo anh ơi!','Absolutely cinematic! You\'re the GOAT!'));
 if(g==='chotdon'){if(happy)tip=Math.round(tip*1.5)+5000;return finish(0,happy?L('Cả nhà ơi, ngon hoá điênggg! Link tiệm chị để ở bình luận nha!','Fam, this is INSANE! Shop link in the comments!'):L('Cả nhà ơi, hơi ô dề nha… nhưng vẫn chốt!','Fam, a bit messy… but still sold!'))}
 if(g&&g.startsWith('haggle')&&g!=='haggle5'){const amt={haggle1:1000,haggle2:2000,haggle3:3000,haggle4:5000}[g];face('happy');setTimeout(()=>{face('front');say(g==='haggle4'?L('Ổ này cô lấy giá hôm qua nha. Bớt 5 nghìn!','Charge me yesterday\'s price. 5,000 off!'):L(`Má con hồi đó bớt cho cô ${amt/1000} nghìn hoài à!`,`Your mom always gave me ${amt/1000},000 off!`));voice('co_ba_5');
   choice(L('Dạ, bớt cho cô','OK, discount'),L('Má con dặn không bớt','Mom said no discounts'),()=>{pay-=amt;S.results.cobaDiscount=true;face('happy');say(L('Ngoan! Giống má con y chang.','Good boy! Just like your mom.'));sfx.coin();finish(1800)},()=>{tip=0;face('angry');say(L('Hừ! Mai cô vẫn ghé… nhưng cô méc má con!','Hmph! I\'ll still come… but I\'m telling your mom!'));sfx.bad();finish(2200)})},900);return}
 if(g==='haggle5'){face('front');say(L('Hôm nay cô hông đòi bớt. Ba của Na đang coi kìa.','No discount today. Na\'s dad is watching.'),2400);return finish(2400)}
 if(c.id==='anh_tuan'&&happy){face('eating');setTimeout(()=>{face('shocked');say(L('Ổn. Nhưng… sao không cay vậy em?!','Good. But… why isn\'t it spicy?!'));cv(c,'happy');huySay(L('Anh kêu KHÔNG ỚT mà!!','You SAID no chili!!'),'shocked');setTimeout(()=>{S.money+=pay+tip;S.served++;S.happy++;setMoney();coinPop(pay+tip);setTimeout(()=>{S.busy=false;exitCust()},1500)},1600)},1000);return}
 if(g==='coins'||g==='teacher'){face('happy');say(L('Con trả bằng xu nha chú! Lụm lẹ nha!','Coins, mister! Grab them quick!'));const unit=Math.round(o.total/10/1000)*1000||2000;setTimeout(()=>coins(n=>{pay=n*unit;if(n<10){face('shocked');say(L('Con chỉ có nhiêu đó thôi hà…','That\'s all I\'ve got…'),1600)}
   if(g==='teacher'){S.pending.unshift({id:'co_hanh',gag:'teacher_in',o:{r:'op_la',drink:'cafe'},idx:99});S.spawnT=0}finish(n<10?1700:300)}),1100);return}
 if(g==='lottery'){face('happy');setTimeout(()=>{say(L('Mua giùm bà tờ vé số đi con! 10 nghìn thôi.','Buy a lottery ticket, dear! Only 10k.'));cv(c,'arrive');choice(L('Mua 1 tờ (10k)','Buy one (10k)'),L('Thôi bà ơi','No thanks'),()=>{SV.lottery=1;saveSV();S.results.lotteryBought=1;pay-=10000;face('happy');say(L('Cầu cho con trúng số!','May you win!'));finish(1800)},()=>{face('angry');say(L('Hừ, số này trúng đó nghen!','Hmph, these are winning numbers!'));finish(1800)})},900);return}
 if(g==='lottery_result'){if(SV.lottery){S.results.lotteryWin=1;pay+=50000;face('happy');say(L('Con ơi! Tờ vé số hôm bữa trúng 50 nghìn nè!','Your ticket won 50k!'),2600);sfx.cheer();SV.lottery=0;saveSV();return finish(2600)}else{face('front');say(L('Số bữa bà mời con trúng 50 nghìn đó. Tiếc chưa!','The number I offered you won 50k. Too bad!'),2600);return finish(2600)}}
 if(g==='inlaw'){S.results.inlawHappy=happy;finish(0,happy?L('Ui chao… được! Ba cho qua!','Oh my… good! You pass!'):L('Cũng tạm. Còn phải học nhiều.','Passable. Still much to learn.'));return}
 if(g==='live'){say(happy?L('Mười điểm, bấm like nha cả nhà!','10/10, smash that like button!'):L('Wow… sáng tạo ghê…','Wow… so… creative…'),2200);return finish(1200)}
 face('happy');finish(800)}
function coinPop(v){const el=document.createElement('div');el.className='moneyPop';el.textContent='+'+fmt(v);stage.appendChild(el);setTimeout(()=>el.remove(),1200);sfx.coin()}
function coins(done){banner(UI.coins);S.busy=true;let got=0,left=10;const els=[];
 for(let j=0;j<10;j++){const el=document.createElement('div');el.className='coin';el.textContent='xu';el.style.left=(330+Math.random()*940)+'px';el.style.top=(150+Math.random()*300)+'px';
  el.addEventListener('pointerdown',ev=>{ev.stopPropagation();el.remove();got++;sfx.coin();if(--left===0)end()});stage.appendChild(el);els.push(el)}
 const tm=setTimeout(end,6000);let ended=false;function end(){if(ended)return;ended=true;clearTimeout(tm);els.forEach(e=>e.remove());banner(null);done(got)}}
/* ---------- end of day ---------- */
const ENDLESS_POOL=['co_ba','anh_tuan','be_ti','chi_linh','mai','ong_nam','ba_sau','chi_thu','minh','be_bong','anh_son','co_dieu','van','bao','tom','coach','chot','tu_mukbang','su_genz','shipper','chu_tu'];
function endlessCust(){S.eIdx=(S.eIdx||0)+1;let id=rnd(ENDLESS_POOL);if(id===S.lastE)id=rnd(ENDLESS_POOL);S.lastE=id;
 const rs=Object.keys(RECIPES),o={r:rnd(rs)};if(Math.random()<.5)o.drink=rnd(Object.keys(DRINKS));if(Math.random()<.3)o.chili=1;if(Math.random()<.25)o.sauce=rnd(['fish','chili']);
 if(S.served>=6&&Math.random()<.18)o.qty=2;if(S.served>=12&&Math.random()<.1)o.qty=3;let gag;
 if(id==='anh_tuan'){o.noChili=1;delete o.chili}if(id==='co_dieu'){o.noButter=1;o.noPate=1}if(id==='be_bong'){o.r='egg_only';delete o.chili}if(id==='tom'){o.noCilantro=1;gag='english'}if(id==='chu_tu'){gag='usual';delete o.r;delete o.drink}
 if(id==='mai')gag='live';if(id==='chot')gag='chotdon';if(id==='tu_mukbang'){gag='mukbang';o.qty=2}if(id==='su_genz'){gag='genz';o.noChili=1;delete o.chili}if(id==='shipper')gag='shipper';if(id==='chi_thu'){o.drink='cafe';o.strong=1}
 return {id,gag,o,idx:S.eIdx}}
function startEndless(){startDay(8);S.endless=true;S.eIdx=0;toast(L('Bán tới sáng! Để mất 3 khách là đóng tiệm.','Open till dawn! Lose 3 customers and it\'s over.'),3500)}
function endEndless(){stopTick();banner(null);S.cur=null;S.queue=[];drawQueue();ticket();$('custWrap').className='abs';$('bubble').classList.remove('show');$('choices').innerHTML='';$('skipBtn').style.display='none';hint([]);setCarry(null);ghostStop();$('pat').style.display='none';$('patL').style.display='none';liveOff();
 const best=Math.max(SV.endBest||0,S.money),isNew=S.money>(SV.endBest||0);SV.endBest=best;SV.bank+=S.money;saveSV();setMusic('eve');sfx.ding();
 card(`<h2>🌙 ${say_(DAYNAME[8])}</h2><div style="font-size:30px">${say_(L('Bán được','Sold'))}: <b>${S.served}</b> ${say_(L('khách','customers'))} · ${say_(UI.earned)}: <b>${fmt(S.money)}</b></div>
  <div style="font-size:30px;color:#c8361f;font-weight:800">${isNew?say_(L('🏆 Kỷ lục mới!','🏆 New record!')):say_(L('Kỷ lục','Record'))+': '+fmt(best)}</div>
  <div style="font-size:24px;color:#8a5a2b">${say_(S.served>=20?L('Na: "Anh bán xuyên đêm luôn á? Mãi keo!"','Na: "You sold all night? Legend!"'):S.served>=10?L('Na: "Cũng vuýp đó anh."','Na: "Pretty slick, dear."'):L('Na: "Mai tập thêm nghe anh."','Na: "Practice more tomorrow, dear."'))}</div>
  <div class="row"><button class="big" id="eAgain">${say_(UI.again)}</button><button class="big alt" id="toShop">🛒 ${say_(UI.shop)}</button><button class="tbtn" id="toMenu">${say_(UI.menu)}</button></div>`);
 $('eAgain').onclick=()=>{hideCard();startEndless()};$('toShop').onclick=()=>shop(()=>endEndless._card());$('toMenu').onclick=()=>{hideCard();showMenu()};endEndless._card=()=>{hideCard();showMenu()}}
function endDay(){stopTick();const d=S.day,D=DAYS[d];banner(null);S.cur=null;S.queue=[];drawQueue();ticket();$('custWrap').className='abs';$('bubble').classList.remove('show');$('choices').innerHTML='';$('skipBtn').style.display='none';hint([]);setCarry(null);$('pat').style.display='none';$('patL').style.display='none';$('speakerFx').classList.remove('on');S.speaker=false;S.mute=false;
 const stars=D.targets.filter(t=>S.money>=t).length;S.results.money=S.money;S.results.stars=Math.max(0,stars-1);S.results.dogStolen=S.dogStolen;
 SV.bank+=S.money;SV.best[d]=Math.max(SV.best[d]||0,S.money);SV.stars[d]=Math.max(SV.stars[d]||0,stars);if(stars>=1)SV.unlocked=Math.max(SV.unlocked,d+1);saveSV();
 setMusic('eve');vnPlay(eveningScript(d,S.results),()=>dayResults(stars))}
function dayResults(stars){const d=S.day,pass=stars>=1;setMusic('day');
 card(`<h2>${say_(UI.day)} ${d}: ${say_(DAYNAME[d])}</h2><div style="font-size:64px;color:#e0a800;letter-spacing:6px">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
  <div>${say_(UI.earned)}: <b>${fmt(S.money)}</b> · ${say_(UI.happyC)}: <b>${S.happy}/${S.served+S.lost}</b></div>
  <div style="font-size:22px;color:#8a5a2b">${say_(L('Mục tiêu','Targets'))}: ★ ${fmt(DAYS[d].targets[0])} · ★★ ${fmt(DAYS[d].targets[1])} · ★★★ ${fmt(DAYS[d].targets[2])}</div>
  ${pass?'':`<div style="color:#c8361f;font-weight:800">${say_(L('Cần ít nhất 1 sao để mở ngày tiếp theo','You need at least 1 star to unlock the next day'))}</div>`}
  <div class="row"><button class="big alt" id="toShop">🛒 ${say_(UI.shop)}</button>${pass&&d<7?`<button class="big" id="nextDay">${say_(UI.next)}</button>`:''}<button class="big" id="again">${say_(UI.again)}</button><button class="tbtn" id="toMenu">${say_(UI.menu)}</button></div>`);
 $('toShop').onclick=()=>shop(()=>dayResults(stars));if($('nextDay'))$('nextDay').onclick=()=>startDay(d+1);$('again').onclick=()=>startDay(d);$('toMenu').onclick=()=>showMenu()}
function shop(back){let h=`<h2>🛒 ${say_(UI.shop)}</h2><div style="font-size:30px">${say_(UI.bank)}: <b>${fmt(SV.bank)}</b></div><div class="shopGrid">`;
 Object.entries(UPGRADES).forEach(([k,u])=>{const own=has(k),can=SV.bank>=u.price;h+=`<div class="shopItem${own?' own':''}"><div class="ic">${u.icon}</div><b>${say_(u.n)}</b><small>${say_(u.d)}</small>${own?`<span class="tag">✓ ${say_(UI.owned)}</span>`:`<button class="big ${can?'alt':''}" data-buy="${k}" ${can?'':'disabled'}>${say_(UI.buy)} ${fmt(u.price)}</button>`}</div>`});
 card(h+`</div><div class="row"><button class="big" id="shopBack">◀ OK</button></div>`);$('card').classList.add('wide');
 document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const k=b.dataset.buy,u=UPGRADES[k];if(SV.bank<u.price)return;SV.bank-=u.price;SV.up[k]=1;saveSV();sfx.cheer();shop(back)});
 $('shopBack').onclick=()=>{$('card').classList.remove('wide');back()}}
/* ---------- contest ---------- */
function startContest(){S.contest={round:0,me:[],kevin:[]};setMusic('contest');$('scoreBoard').style.display='block';drawScore();nextRound()}
function drawScore(){const C=S.contest,sum=a=>a.reduce((x,y)=>x+y,0);$('scoreBoard').innerHTML=`<b>${say_(UI.contest)} · ${say_(UI.round)} ${Math.min(C.round+1,5)}/5</b><div>A Huy: <b>${sum(C.me)}</b></div><div>Kevin: <b>${sum(C.kevin)}</b></div>`}
function nextRound(){const C=S.contest;if(C.round>=5)return endContest();const R=CONTEST[C.round];
 const c={id:R.judge==='ma'?'ma':R.judge,gag:'judge',order:makeOrder(R.o,R.judge),p:100,mistakes:0,maxP:DAYS[7].patience+(R.o.drink?16:0)};
 if(R.judge==='ma'&&!CHARS.ma)CHARS.ma={name:'Má Lan',faces:{front:'front',happy:'happy',angry:'strict',shocked:'shocked',eating:'eating'},voice:'ma'};
 S.contestJudgeLine=R.line;toast(L(`Vòng ${C.round+1}: giám khảo ${CHARS[c.id].name}`,`Round ${C.round+1}: judge ${CHARS[c.id].name}`),2000);
 S.pending=[];S.queue=[];promoteJudge(c)}
function promoteJudge(c){S.cur=c;S.unit=1;S.placed={};S.sauced=false;S.drinkDone=false;S.step='arrive';S.busy=true;resetBread();const w=$('custWrap');w.className='abs';face('front');ticket();$('pat').style.display='block';$('patL').style.display='block';
 requestAnimationFrame(()=>requestAnimationFrame(()=>w.classList.add('in')));c.hi=S.contestJudgeLine;setTimeout(()=>{say(c.hi);cv(c,'arrive');setTimeout(()=>{S.busy=false;step('slice');startTick()},800)},850)}
const _serve=serve;
serve=function(){if(!S.contest)return _serve();const c=S.cur,C=S.contest;stopTick();S.step='done';S.busy=true;banner(null);hint([]);setCarry(null);setPose('thumbs_up');sfx.ding();
 const sc=Math.round(100*Math.max(0,1-.25*c.mistakes)*(.5+.5*Math.max(0,c.p)/100)),kv=60+Math.floor(Math.random()*22);C.me.push(sc);C.kevin.push(kv);C.round++;drawScore();face('eating');say(L(`Điểm của A Huy: ${sc}! Kevin: ${kv}.`,`Huy scores ${sc}! Kevin: ${kv}.`),2600);if(sc>=kv)sfx.cheer();
 setTimeout(()=>{$('custWrap').classList.add('out');setTimeout(()=>{S.cur=null;S.busy=false;ticket();resetBread();setPose('open');nextRound()},950)},2700)};
const _leave=leave;
leave=function(c){if(!S.contest)return _leave(c);const C=S.contest;stopTick();S.step='done';C.me.push(0);C.kevin.push(60+Math.floor(Math.random()*22));C.round++;drawScore();face('angry');say(L('Hết giờ! 0 điểm!','Time\'s up! 0 points!'),2000);sfx.bad();setTimeout(()=>{$('custWrap').classList.add('out');setTimeout(()=>{S.cur=null;S.busy=false;ticket();resetBread();nextRound()},950)},2000)};
function endContest(){stopTick();const C=S.contest,me=C.me.reduce((a,b)=>a+b,0),kv=C.kevin.reduce((a,b)=>a+b,0),win=me>kv;$('pat').style.display='none';$('patL').style.display='none';
 const stars=win?(me>=420?3:me-kv>=60?2:1):0;SV.best[7]=Math.max(SV.best[7]||0,me);SV.stars[7]=Math.max(SV.stars[7]||0,stars);saveSV();S.contest=null;$('scoreBoard').style.display='none';
 setMusic(win?'day':'eve');vnPlay(win?CONTEST_END.win:CONTEST_END.lose,()=>{card(`<h2>${win?say_(L('🏆 Vô địch!','🏆 Champion!')):say_(L('Suýt nữa thôi!','So close!'))}</h2><div style="font-size:64px;color:#e0a800">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div>A Huy <b>${me}</b> – Kevin <b>${kv}</b></div><div style="font-size:22px;color:#8a5a2b">Mike Do X Claude</div><div class="row"><button class="big" id="again">${say_(UI.again)}</button><button class="big alt" id="toMenu">${say_(UI.menu)}</button></div>`);$('again').onclick=()=>startDay(7);$('toMenu').onclick=()=>showMenu()})}
/* ---------- VN dialogue ---------- */
const CH={na:{n:'Na',side:'L',k:1.1,f:f=>'p_na_'+(f||'front')},ma:{n:'Má Lan',side:'L',k:1.16,f:f=>'p_ma_'+(f||'front')},huy:{n:'A Huy',side:'R',k:1,f:f=>'p_a_huy_'+(f||'front')},keo:{n:'Kẹo',side:'L',k:1.6,pet:1,f:()=>'p_keo_front'},mochi:{n:'Mochi',side:'L',k:1.6,pet:1,f:()=>'p_mochi_front'},call:{n:'Má Lan 📱',side:'L',phone:1,f:()=>'ma_call'},
 kevin:{n:'Kevin',side:'L',k:1,f:f=>'p_kevin_'+(f||'front')},chu_hai:{n:'Chú Hai',side:'L',k:1,f:f=>'p_chu_hai_'+(f||'front')},chloe:{n:'Chloe',side:'L',k:0.6,pet:1,f:f=>'p_chloe_'+(f||'sit_smile')},
 ong_thanh:{n:CHARS.ong_thanh.name,side:'L',k:1.45,f:f=>'c_ong_thanh_'+(f||'front')},co_hanh:{n:'Cô giáo Hạnh',side:'L',k:1.45,f:f=>'c_co_hanh_'+(f||'front')},tom:{n:'Tom',side:'L',k:1.45,f:f=>'c_tom_'+(f||'front')},
 co_ba:{n:'Cô Ba',side:'L',k:1.45,f:()=>'co_ba_front'},anh_tuan:{n:'Anh Tuấn',side:'L',k:1.45,f:f=>'c_anh_tuan_'+(f||'front')}};
const VN={on:false};
function vnPlay(lines,done){stopTickSoft();Object.assign(VN,{on:true,lines,i:0,done,typing:false});['vnL','vnR'].forEach(id=>{const e=$(id);e.className='vnP';e.dataset.who=''});$('vn').classList.add('on');setPose('point');vnLabels();vnRender()}
function stopTickSoft(){S.paused=true}
function vnLabels(){$('vnSkip').textContent=LANG==='vi'?'Bỏ qua ⏩':'Skip ⏩';$('vnLang').textContent=LANG==='vi'?'EN':'VI';$('vnDay').textContent=say_(UI.day)+' '+(S.day||1)}
function vnRender(instant){const ln=VN.lines[VN.i];if(!ln)return vnEnd();
 if(ln.cal){$('vnTime').textContent=ln.cal[0];$('vnPart').textContent=say_(ln.cal[1])}if(ln.tint)$('vnTint').style.background=ln.tint;
 if(ln.hide==='both')['vnL','vnR'].forEach(id=>{$(id).classList.remove('show');$(id).dataset.who=''});
 const box=$('vnBox');box.className='';
 if(ln.who==='narr'){box.classList.add('narr');['vnL','vnR'].forEach(id=>$(id).classList.add('dim'))}
 else{const c=CH[ln.who],slot=$('vn'+c.side),other=$(c.side==='L'?'vnR':'vnL');if(c.side==='R')box.classList.add('right');
  $('vnName').textContent=c.n;other.classList.add('dim');slot.classList.remove('dim','pet','phone');if(c.pet)slot.classList.add('pet');if(c.phone)slot.classList.add('phone');
  const src='assets/'+c.f(ln.f)+'.webp',fresh=slot.dataset.who!==ln.who;slot.dataset.who=ln.who;
  const size=()=>{if(c.phone){slot.style.height='500px';slot.style.width='320px'}else{slot.style.width='auto';slot.style.height=(slot.naturalHeight*c.k)+'px'}};slot.onload=size;
  if(fresh){slot.classList.remove('show');slot.src=src;void slot.offsetWidth;requestAnimationFrame(()=>slot.classList.add('show'))}else{slot.src=src;slot.classList.remove('talk');void slot.offsetWidth;slot.classList.add('talk')}
  if(slot.complete&&slot.naturalHeight)size();if(ln.sfx&&sfx[ln.sfx])sfx[ln.sfx]()}
 if(ln.vo)voice(ln.vo);
 const txt=say_(ln.t),el=$('vnText');clearInterval(VN.tm);$('vnNext').style.visibility='hidden';
 if(instant){el.textContent=txt;VN.typing=false;$('vnNext').style.visibility='visible';return}
 let n=0;VN.typing=true;el.textContent='';VN.tm=setInterval(()=>{n+=1;el.textContent=txt.slice(0,n);if(n%3===0&&!ln.vo)tone(620+Math.random()*120,.025,'triangle',.03);if(n>=txt.length){clearInterval(VN.tm);VN.typing=false;$('vnNext').style.visibility='visible'}},24)}
function vnClick(){if(VN.typing){clearInterval(VN.tm);VN.typing=false;$('vnText').textContent=say_(VN.lines[VN.i].t);$('vnNext').style.visibility='visible';return}
 const ln=VN.lines[VN.i];if(ln.hideAfter){$('vn'+ln.hideAfter).classList.remove('show');$('vn'+ln.hideAfter).dataset.who=''}
 VN.i++;if(VN.i>=VN.lines.length)return vnEnd();sfx.pop();vnRender()}
function vnEnd(){clearInterval(VN.tm);VN.on=false;S.paused=false;$('vn').classList.remove('on');setPose('open');const d=VN.done;VN.done=null;if(d)d()}
$('vnSkip').onclick=()=>vnEnd();$('vnLang').onclick=()=>{toggleLang();vnLabels();vnRender(true)};
/* ---------- menu ---------- */
const MT={play:L('▶ Chơi','▶ Play'),cont:L('▶ Chơi tiếp','▶ Continue'),days:L('Chọn ngày','Days'),chars:L('Nhân vật','Characters'),set:L('Cài đặt','Settings'),close:L('Đóng','Close'),day:L('Ngày','Day'),lang:L('Ngôn ngữ','Language'),sound:L('Âm thanh','Sound'),music:L('Nhạc nền','Music'),reset:L('Xóa tiến trình','Reset progress'),on:L('Bật','On'),off:L('Tắt','Off'),locked:L('Cần 1★ ngày trước','Need 1★ on previous day')};
const GAL=[['a_huy','A Huy',L('"Dễ ợt!"','"Easy!"')],['na','Na',L('"Anh làm chi rứa?!"','"What are you doing?!"')],['ma','Má Lan',L('"Bán dở là má biết liền!"','"I\'ll know if sales are bad!"')],['chloe','Chloe',L('"Ê a… hihi!"','"Ba-ba… hehe!"')],['co_ba','Cô Ba',L('"Má con hồi đó bớt cho cô mà!"','"Your mom gave me discounts!"')],['anh_tuan','Anh Tuấn',L('"Không ớt nha em!"','"No chili!"')],['be_ti','Bé Tí',L('"Cay xé lưỡi luôn!"','"Super spicy!"')],['chi_linh','Chị Linh',L('"Khách hối rồi em ơi!"','"Customer\'s waiting!"')],['chu_tu','Chú Tư',L('"Như mọi khi nha con!"','"The usual, kid!"')],['ong_nam','Ông Năm',L('"Hồi xưa có 500 đồng à!"','"It used to cost 500đ!"')],['mai','Mai',L('"Hello cả nhà!"','"Hi everyone!"')],['ba_sau','Bà Sáu',L('"Mua giùm bà tờ đi con!"','"Buy a ticket, dear!"')],['chi_thu','Chị Thu',L('"Cà phê đậm, thật đậm…"','"Strong coffee, really strong…"')],['bao','Bảo',L('"Lên TikTok được không anh?"','"Is it TikTok-able?"')],['minh','Minh Gym',L('"Thêm thịt! Gấp đôi!"','"Extra meat! Double!"')],['be_bong','Bé Bông',L('"Con chỉ ăn trứng thôi!"','"Only egg for me!"')],['anh_son','Anh Sơn',L('"Cho anh em công trình!"','"For my crew!"')],['kevin','Kevin',L('"Bánh mì fusion, bro!"','"Fusion bánh mì, bro!"')],['tom','Tom',L('"No cilantro, please!"','"No cilantro, please!"')],['co_hanh','Cô giáo Hạnh',L('"Bé Tí! Giờ này mà còn ở đây?"','"Bé Tí! Why aren\'t you in class?"')],['co_dieu','Cô Diệu',L('"Không bơ, không pa-tê!"','"No butter, no pâté!"')],['ong_thanh',CHARS.ong_thanh.name,L('"Răng mà lâu rứa con?"','"Why so slow, son?"')],['van','Cô Vân',L('"Giống má con quá!"','"Just like your mom!"')],['chu_hai','Chú Hai',L('"Alô alô! Hội thi bắt đầu!"','"Hello hello! The contest begins!"')],['keo','Kẹo',L('"Gâu!"','"Woof!"')],['mochi','Mochi',L('"Meo."','"Meow."')],['coach','Coach Tài Lộc',L('"Tư duy triệu đô, ví… 15 nghìn."','"Million-dollar mindset, 15k wallet."')],['chot','Chị Bé Chốt Đơn',L('"Chốt! Chốt! Chốt!"','"Sold! Sold! Sold!"')],['tu_mukbang','Anh Tư Mukbang',L('"Quẹo lựa bà con ơi!"','"Step right up, folks!"')],['su_genz','Bé Su',L('"Khum ớt nha, ét o ét!"','"Khum chili, SOS!"')],['shipper','Anh Long Shipper',L('"Khách gọi ba cuộc rồi anh ơi!"','"My customer called three times!"')]];
const mt=k=>say_(MT[k]);
function showMenu(){hideCard();$('panel').classList.remove('on');stopTick();S={day:0};VN.on=false;$('vn').classList.remove('on');ticket();$('custWrap').className='abs';$('bubble').classList.remove('show');$('pat').style.display='none';$('patL').style.display='none';banner(null);hint([]);resetBread();$('queue').innerHTML='';$('scoreBoard').style.display='none';liveOff();
 ['rainFx','powerFx','speakerFx'].forEach(i=>$(i).classList.remove('on'));$('chloe').style.display='none';$('kiosk').style.display='none';
 const nd=Math.min(7,SV.unlocked);$('mPlay').textContent=nd>1?mt('cont')+' · '+mt('day')+' '+nd:mt('play');$('mDays').textContent=mt('days');$('mChars').textContent=mt('chars');$('mSet').textContent=mt('set');$('menu').classList.add('on');setPose('point');setMusic('day')}
function hideMenu(){$('menu').classList.remove('on');$('panel').classList.remove('on')}
function panel(h){$('panelBox').innerHTML=h+`<div class="row" style="margin-top:18px"><button class="big" id="pClose">${mt('close')}</button></div>`;$('panel').classList.add('on');$('pClose').onclick=()=>$('panel').classList.remove('on')}
$('mPlay').onclick=()=>{ac();sfx.ding();startDay(Math.min(7,SV.unlocked))};
$('mDays').onclick=()=>{let h=`<h2>${mt('days')}</h2><div class="grid">`;const eOpen=SV.unlocked>7||(SV.stars[7]||0)>0;for(let d=1;d<=7;d++){const st=SV.stars[d]||0,b=SV.best[d]||0,open=d<=SV.unlocked;h+=open?`<button class="dcard" data-d="${d}">${mt('day')} ${d}<span class="st">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span><small>${say_(DAYNAME[d])}</small><small>${b?(d===7?b+' đ.':fmt(b)):''}</small></button>`:`<div class="dcard lock">🔒 ${mt('day')} ${d}<small>${mt('locked')}</small></div>`}h+=eOpen?`<button class="dcard endless" id="eCard">🌙 ${say_(DAYNAME[8])}<small>${say_(L('Chơi không giới hạn','Endless mode'))}</small><small>${SV.endBest?say_(L('Kỷ lục','Record'))+': '+fmt(SV.endBest):''}</small></button>`:`<div class="dcard lock">🔒 🌙<small>${say_(L('Thắng hội thi để mở','Win the contest to unlock'))}</small></div>`;panel(h+'</div>');if($('eCard'))$('eCard').onclick=()=>{$('panel').classList.remove('on');startEndless()};document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{$('panel').classList.remove('on');startDay(+b.dataset.d)})};
$('mChars').onclick=()=>{let h=`<h2>${mt('chars')}</h2><div class="grid gal">`;GAL.forEach(([k,n,q],i)=>h+=`<div class="ccard" data-i="${i}"><img src="assets/g_${k}.webp" alt=""><b>${n}</b></div>`);panel(h+`</div><div id="galQ">${L('Chạm vào nhân vật để nghe họ nói','Tap a character to hear them')[LANG]||''}</div>`);document.querySelectorAll('.gal .ccard').forEach(c=>c.onclick=()=>{document.querySelectorAll('.gal .ccard').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');const [k,n,q]=GAL[+c.dataset.i];$('galQ').innerHTML=`<b style="color:#c8361f">${n}:</b> ${say_(q)}`;const ch=CHARS[k];if(ch&&ch.voice)voice(ch.voice+'_0');else{const vk=(k==='a_huy'?'huy':k)+'_0';if(window.VO_OK&&VO_OK.has(vk))voice(vk)}sfx.pop()})};
$('mSet').onclick=function setP(){panel(`<h2>${mt('set')}</h2><div class="srow">${mt('lang')}: <button class="big alt" id="sLang">${LANG==='vi'?'Tiếng Việt':'English'}</button></div><div class="srow">${mt('sound')}: <button class="big alt" id="sSnd">${SOUND?mt('on'):mt('off')}</button></div><div class="srow">${mt('music')}: <button class="big alt" id="sMus">${MUSIC?mt('on'):mt('off')}</button></div><div class="srow"><button class="big" id="sReset">${mt('reset')}</button></div>`);
 $('sLang').onclick=()=>{toggleLang();showMenu();setP()};$('sSnd').onclick=()=>{SOUND=!SOUND;setP()};$('sMus').onclick=()=>{MUSIC=!MUSIC;MUSIC?startMusic():stopMusic();setP()};$('sReset').onclick=()=>{SV={unlocked:1,best:{},stars:{},bank:0,up:{},lottery:0};saveSV();sfx.bad();showMenu();setP()}};
$('homeBtn').onclick=()=>{if(VN.on){clearInterval(VN.tm);VN.on=false;VN.done=null;$('vn').classList.remove('on')}showMenu()};
function card(h){$('card').innerHTML=h;$('ov').classList.remove('hidden')}
function hideCard(){$('ov').classList.add('hidden');$('card').classList.remove('wide')}
function toggleLang(){LANG=LANG==='vi'?'en':'vi';labels();ticket();if(S.step&&STEP_UI[S.step]&&!['done','arrive'].includes(S.step))banner(UI[STEP_UI[S.step]])}
$('langBtn').onclick=toggleLang;$('sndBtn').onclick=()=>{MUSIC=!MUSIC;$('sndBtn').style.opacity=MUSIC?1:.4;MUSIC?startMusic():stopMusic()};
/* ---------- boot ---------- */
labels();fit();drawHand();$('ticket').style.display='none';$('huyAv').style.backgroundImage='url(assets/a_huy_happy.webp)';
document.addEventListener('pointerdown',()=>{ac();if(MUSIC&&!MUS.timer)startMusic()},{once:true});
showMenu();
/* test hooks */
window.__G={get S(){return S},SV:()=>SV,startDay,step,serve:()=>serve(),endDay,VN,vnEnd,DAYS,CHARS};

/* ---------- loading screen ---------- */
(function boot(){const list=window.PRELOAD||[],tot=list.length;let n=0,done=false,t=0;const el=id=>document.getElementById(id);
 const tips=[L('Đang nướng bánh…','Baking the bread…'),L('Đang thái chả lụa…','Slicing the pork roll…'),L('Đang giấu chả lụa khỏi Kẹo…','Hiding the pork roll from Kẹo…'),L('Mochi đang kiểm tra hàng…','Mochi is inspecting the stock…'),L('Đang dỗ Chloe ngủ…','Rocking Chloe to sleep…')];
 const fin=()=>{if(done)return;done=true;const l=el('loader');if(!l)return;l.classList.add('done');setTimeout(()=>l.remove(),600);clearInterval(tt)};
 const upd=()=>{const p=Math.round(n*100/Math.max(tot,1));if(el('lfill'))el('lfill').style.width=p+'%';if(el('lpct'))el('lpct').textContent=p+'%'};
 const tt=setInterval(()=>{if(el('ltip'))el('ltip').textContent=say_(tips[t++%tips.length])},1600);
 if(!tot)return fin();list.forEach(f=>{const im=new Image();im.onload=im.onerror=()=>{n++;upd();if(n>=tot)setTimeout(fin,250)};im.src='assets/'+f});setTimeout(fin,15000)})();
