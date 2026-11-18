import sys, os
sys.path.insert(0,os.path.dirname(__file__))
from cutout import cut, order
from PIL import Image
sheet, folder, cid = sys.argv[1:4]; faces=sys.argv[4].split(',')
items,_=cut(sheet, min_h=300, merge=int(os.environ.get('MERGE','9')))
items=order(items,row_tol=400)
print(folder,'found',len(items),'expected',len(faces))
if len(items)!=len(faces): sys.exit(1)
d=f'sprites/{folder}';os.makedirs(d,exist_ok=True)
A='assets/'
for (p,im),f in zip(items,faces):
    im.save(f'{d}/{folder}_{f}.png')
    bb=im.getbbox(); im=im.crop(bb)
    w=round(im.width*640/im.height); im.resize((w,640),Image.LANCZOS).save(A+f'c_{cid}_{f}.webp',quality=88)
    if f==faces[0]:
        w=round(im.width*300/im.height); im.resize((w,300),Image.LANCZOS).save(A+f'g_{cid}.webp',quality=88)
print('ok')
