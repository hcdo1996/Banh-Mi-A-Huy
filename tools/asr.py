import sys, numpy as np, soundfile as sf
from faster_whisper import WhisperModel
m=WhisperModel('small',device='cpu',compute_type='int8')
for f in sys.argv[1:]:
    a,sr=sf.read(f,dtype='float32')
    segs,info=m.transcribe(a,language='vi',vad_filter=False)
    print(f, '|', ' '.join(s.text.strip() for s in segs))
