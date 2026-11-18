cd "$(dirname "$0")/.." && python3 -c "
import os;k=sorted(f[:-4] for f in os.listdir('assets/vo') if f.endswith('.mp3'))
open('vo_list.js','w').write('window.VO_OK=new Set('+repr(k).replace(\"'\",'\"')+');')
print(len(k))"
