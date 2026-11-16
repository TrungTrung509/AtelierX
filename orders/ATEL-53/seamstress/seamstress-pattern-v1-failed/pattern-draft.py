import json
from pathlib import Path
MAT='grayshirt'; PHYS={'preset':'Cotton','density':150,'stretch':80,'shear':60,'bend':26,'damping':22,'friction':40,'thickness':2.5}
pieces=[]; seams=[]
def add(name,pts,pos,rot=(0,0,0),origin=(0,0),curv=0):
    pid=f'q{len(pieces)+1:02d}'; arr=[]
    for p in pts: arr.append({'at':[p[0],p[1]],**({'curve':[p[2],p[3]]} if len(p)>2 else {})})
    pieces.append({'id':pid,'name':name,'visible':True,'origin':origin,'points':arr,'placement':{'position':pos,'rotation':rot,'curvature':curv},'physics':PHYS.copy(),'material':MAT,'uv':{'offset':[0,0],'scale':1,'rotation':0}})
    return pid
def seam(a,ea,b,eb,rev=False): seams.append({'id':f't{len(seams)+1:02d}','from':{'piece':a,'edge':ea},'to':{'piece':b,'edge':eb},'reversed':rev})
# Full front and back shirt-body panels in the Seamstress shirt pattern workflow.
front=add('Front body',[(0,0),(50,0),(50,45,41,50),(42,68),(36,70,25,63),(14,70),(8,68,9,50),(0,45)],[0,1.09,0.265],origin=[0,0])
back=add('Back body',[(0,0),(50,0),(50,45,41,50),(42,68),(36,70,25,67.5),(14,70),(8,68,9,50),(0,45)],[0,1.09,-0.175],(0,180,0),origin=[65,0])
# Same armhole/shoulder matching on front/back; neck is shallower on front than a T-shirt scoop.
seam(front,1,back,7,False); seam(front,7,back,1,False)
seam(front,3,back,5,False); seam(front,5,back,3,False)
# Sleeves use a full-width sleeve pattern with armhole cap split into two sewable arcs.
sleeves=[]; cuffs=[]
for side,sign in [('L',1),('R',-1)]:
    sl=add(f'Sleeve {side}',[(4,-35),(38,-35),(42,16,34,28),(21,34,8,28),(0,16)],[0.34*sign,1.12,0.045],(0,90*sign,35*sign),origin=[0,90 if side=='L' else 155],curv=150)
    sleeves.append(sl)
    if sign==1:
        seam(sl,2,back,6,False); seam(sl,3,front,2,False)
    else:
        seam(sl,2,front,6,False); seam(sl,3,back,2,False)
    seam(sl,1,sl,4,False)
    cuff=add(f'Open cuff {side}',[(0,0),(34,0),(34,8),(0,8)],[0.34*sign,1.12-0.375,0.045],(0,90*sign,35*sign),origin=[52,90 if side=='L' else 155],curv=150)
    cuffs.append(cuff)
    seam(sl,0,cuff,2,False); seam(cuff,1,cuff,3,False)
# Collar stand, split into front/back left-right halves to pair with the corresponding neckline arcs.
standF=[]; standB=[]
for side,sign in [('L',-1),('R',1)]:
    fs=add(f'Front collar stand {side}',[(0,0),(14,0),(14,4),(0,4)],[0.07*sign,1.43,0.30],origin=[130 if side=='L' else 148,0])
    bs=add(f'Back collar stand {side}',[(0,0),(11.5,0),(11.5,4),(0,4)],[0.0575*sign,1.43,-0.19],(0,180,0),origin=[170 if side=='L' else 186,0])
    standF.append(fs); standB.append(bs)
    # front neckline edges are 4 (right half) and 5 (left half); back uses same indices.
    edge=5 if side=='L' else 4
    seam(front,edge,fs,0,False); seam(back,edge,bs,0,False)
    if side=='L': seam(fs,1,bs,1,True)
    else: seam(fs,1,bs,3,False)
# Broad collar leaves, each with a real fold edge sewn to front and back stand tops.
for side,sign in [('L',-1),('R',1)]:
    if side=='L':
        pts=[(0,0),(-14,0),(-25.5,0),(-25.5,2),(-22,6,-20,8),(-14,9,-10,9),(-5,7,-2,5),(0,3)]
        x=-0.1275; sf=standF[0]; sb=standB[0]; eFront=3; eBack=2
    else:
        pts=[(0,0),(14,0),(25.5,0),(25.5,2),(22,6,20,8),(14,9,10,9),(5,7,2,5),(0,3)]
        x=0.1275; sf=standF[1]; sb=standB[1]; eFront=2; eBack=2
    leaf=add(f'Collar leaf {side}',pts,[x,1.49,0.07],origin=[210 if side=='L' else 240,0])
    seam(leaf,0,sf,eFront,False); seam(leaf,1,sb,eBack,False)

doc={'format':'seamstress-garment','version':1,'name':'ATEL-53 Shirt Pattern Draft B','units':{'pattern':'cm','world':'m','angles':'degrees'},'simulation':{'gravity':-9.81,'substeps':16,'timeScale':1,'selfCollision':True,'groundPlane':True},'avatar':{'kind':'Mannequin','scale':1},'materials':[{'id':MAT,'name':'Neutral gray shirt cloth','color':'#9A9A98','repeat':1,'roughness':0.86,'metallic':0,'opacity':1}],'garments':[{'id':'shirtpattern02','name':'Shirt pattern draft B','visible':True,'simulateWithOthers':False,'particleDistance':2.2,'topology':'triangles','groups':[],'pieces':pieces,'seams':seams}]}
Path('/tmp/atelierx-seamstress-preflight/shirt-draft-b.garment.json').write_text(json.dumps(doc,indent=2)+'\n')
print('pieces',len(pieces),'seams',len(seams))
