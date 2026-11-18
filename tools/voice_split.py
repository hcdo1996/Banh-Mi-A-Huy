import sys, json, subprocess, re, os
key, url = sys.argv[1], sys.argv[2]
V=json.load(open('tools/voices.json')); lines=V[key][1]
IDX=[int(x) for x in sys.argv[3].split(',')] if len(sys.argv)>3 else list(range(len(lines)))
lines=[lines[i] for i in IDX]
os.makedirs('tools/raw',exist_ok=True); os.makedirs('assets/vo',exist_ok=True)
raw=f'tools/raw/{key}'+('_'+sys.argv[3].replace(',','') if len(sys.argv)>3 else '')+'.mp3'
if url!='-': subprocess.run(['curl','-sS','-o',raw,url],check=True)
out=subprocess.run(['ffmpeg','-hide_banner','-i',raw,'-af','silencedetect=noise=-38dB:d=1.1','-f','null','-'],capture_output=True,text=True).stderr
starts=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]; ends=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',raw],capture_output=True,text=True).stdout)
segs=[]; t=0.0
for s,e in zip(starts,ends):
    if s>t+0.15: segs.append((t,s))
    t=e
if dur>t+0.15: segs.append((t,dur))
while len(segs)>len(lines):
    gaps=[segs[i+1][0]-segs[i][1] for i in range(len(segs)-1)]; i=gaps.index(min(gaps))
    segs[i:i+2]=[(segs[i][0],segs[i+1][1])]; print('merged gap',round(min(gaps),2))
print(key,'segments',len(segs),'expected',len(lines))
if len(segs)!=len(lines): print('MISMATCH',segs); sys.exit(1)
for i,(a,b) in enumerate(segs):
    a=max(0,a-0.05); b=min(dur,b+0.12)
    mx=0.13*len(lines[i])+1.4
    if b-a>mx: print('TRIM',i,round(b-a,1),'->',round(mx,1)); b=a+mx
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',raw,'-ss',f'{a:.3f}','-to',f'{b:.3f}','-ac','1','-ar','24000','-b:a','40k',f'assets/vo/{key}_{IDX[i]}.mp3'],check=True)
# pitch check
import numpy as np, soundfile as sf
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',raw,'-ar','16000','-ac','1','/tmp/p.wav'])
x,sr=sf.read('/tmp/p.wav')
try:
    import librosa
    f0,vf,vp=librosa.pyin(x,fmin=70,fmax=500,sr=sr); print('median F0', np.nanmedian(f0))
except Exception as e: print('no librosa',e)
