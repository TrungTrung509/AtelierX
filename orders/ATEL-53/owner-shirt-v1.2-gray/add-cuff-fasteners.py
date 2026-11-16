#!/usr/bin/env python3
"""Derive v1.2 from immutable v1.1 by adding one button on each cuff surface."""
import json,struct,hashlib,math
from pathlib import Path
from math import sin,cos,pi
root=Path(__file__).resolve().parents[3]
src=root/'orders/ATEL-53/owner-shirt-v1.1-gray/shirt-gray-v1.1.glb'
out=Path(__file__).resolve().parent/'shirt-gray-v1.2.glb'
EXPECTED='dba1bcc1ae6ff2f1a02bbc557eb17bdfc210b2184c39a67f7d665dec2268be13'
raw=src.read_bytes(); assert hashlib.sha256(raw).hexdigest()==EXPECTED
magic,ver,total=struct.unpack_from('<4sII',raw,0); assert magic==b'glTF' and ver==2 and total==len(raw)
jlen,jtype=struct.unpack_from('<I4s',raw,12); assert jtype==b'JSON'
doc=json.loads(raw[20:20+jlen]); bpos=20+jlen; blen,btype=struct.unpack_from('<I4s',raw,bpos); assert btype==b'BIN\0'; binstart=bpos+8; binary=raw[binstart:binstart+blen]

def read_accessor(ai):
 a=doc['accessors'][ai]; v=doc['bufferViews'][a['bufferView']]; n=a['count']; comps={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]; fmt={5126:'f',5123:'H',5125:'I',5121:'B'}[a['componentType']]; size=struct.calcsize('<'+fmt*comps); stride=v.get('byteStride',size); off=v.get('byteOffset',0)+a.get('byteOffset',0)
 return [struct.unpack_from('<'+fmt*comps,binary,off+i*stride) for i in range(n)]

def norm(x):
 l=math.sqrt(sum(q*q for q in x)); return tuple(q/l for q in x)
def cross(a,b): return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])
def add(a,b): return tuple(x+y for x,y in zip(a,b))
def mul(a,k): return tuple(x*k for x in a)
buttons=[]
for mesh_id,target,side in [(2,(.2591,-.1347,1.1480),'right'),(3,(-.2803,-.1305,1.1396),'left')]:
 prim=doc['meshes'][mesh_id]['primitives'][0]; pos=read_accessor(prim['attributes']['POSITION']); nrm=read_accessor(prim['attributes']['NORMAL'])
 cand=[i for i,p in enumerate(pos) if 1.09<p[2]<1.16 and p[1]<-.07 and nrm[i][1]<-.75]
 i=min(cand,key=lambda i:sum((pos[i][k]-target[k])**2 for k in range(3)))
 p=tuple(float(x) for x in pos[i]); n=norm(tuple(float(x) for x in nrm[i]));
 # Tangent basis with button top facing the sampled cuff normal.
 ref=(0,0,1); u=norm(cross(n,ref)); v=norm(cross(n,u))
 buttons.append({'side':side,'mesh':mesh_id,'surfacePosition':p,'surfaceNormal':n,'vertex':i})

positions=[];normals=[];indices=[]
segments=24; radius=.0085; offset=.0018; thickness=.0028
for spec in buttons:
 p=spec['surfacePosition']; n=spec['surfaceNormal']; ref=(0,0,1); u=norm(cross(n,ref)); v=norm(cross(n,u))
 # 4 vertex rings: cylinder wall bottom/top, top cap, underside cap; two center points.
 base=len(positions)
 def ring(rad,h,normal_fn):
  out=[]
  for k in range(segments):
   a=2*pi*k/segments; radial=add(mul(u,cos(a)),mul(v,sin(a))); q=add(add(p,mul(n,offset+h)),mul(radial,rad)); out.append(len(positions));positions.append(q);normals.append(normal_fn(radial,n))
  return out
 side_bottom=ring(radius,0,lambda r,n:norm(add(mul(r,.96),mul(n,.28))))
 side_top=ring(radius*.90,thickness,lambda r,n:norm(add(mul(r,.92),mul(n,.39))))
 top_ring=ring(radius*.90,thickness,lambda r,n:n)
 top_center=len(positions);positions.append(add(p,mul(n,offset+thickness)));normals.append(n)
 bottom_ring=ring(radius,0,lambda r,n:mul(n,-1))
 bottom_center=len(positions);positions.append(add(p,mul(n,offset)));normals.append(mul(n,-1))
 for k in range(segments):
  j=(k+1)%segments
  # Cylinder wall; cap fans point outward/upward.
  indices.extend([side_bottom[k],side_bottom[j],side_top[j],side_bottom[k],side_top[j],side_top[k]])
  indices.extend([top_center,top_ring[k],top_ring[j]])
  indices.extend([bottom_center,bottom_ring[j],bottom_ring[k]])

# append aligned vertex/index buffers; retain prior binary payload byte-for-byte.
def align4(x): return (x+3)&~3
geo_prefix=binary
pbytes=b''.join(struct.pack('<3f',*p) for p in positions)
nbytes=b''.join(struct.pack('<3f',*n) for n in normals)
ibytes=b''.join(struct.pack('<I',i) for i in indices)
pad=lambda x: b'\0'*((4-(len(x)%4))%4)
views=doc.setdefault('bufferViews',[]); accessors=doc.setdefault('accessors',[])
off=align4(len(geo_prefix)); newbin=geo_prefix+pad(geo_prefix)+pbytes
pview=len(views); views.append({'buffer':0,'byteOffset':off,'byteLength':len(pbytes),'target':34962,'name':'Cuff fasteners positions'})
off=align4(len(newbin)); newbin+=pad(newbin)+nbytes
nview=len(views); views.append({'buffer':0,'byteOffset':off,'byteLength':len(nbytes),'target':34962,'name':'Cuff fasteners normals'})
off=align4(len(newbin)); newbin+=pad(newbin)+ibytes
iview=len(views); views.append({'buffer':0,'byteOffset':off,'byteLength':len(ibytes),'target':34963,'name':'Cuff fasteners indices'})
pacc=len(accessors); accessors.append({'bufferView':pview,'componentType':5126,'count':len(positions),'type':'VEC3','min':[min(p[i] for p in positions) for i in range(3)],'max':[max(p[i] for p in positions) for i in range(3)]})
nacc=len(accessors); accessors.append({'bufferView':nview,'componentType':5126,'count':len(normals),'type':'VEC3'})
iacc=len(accessors); accessors.append({'bufferView':iview,'componentType':5125,'count':len(indices),'type':'SCALAR','min':[min(indices)],'max':[max(indices)]})
mesh_id=len(doc['meshes']);doc['meshes'].append({'name':'Cuff fastening buttons (2)','primitives':[{'attributes':{'POSITION':pacc,'NORMAL':nacc},'indices':iacc,'material':0,'mode':4}]})
node_id=len(doc['nodes']);doc['nodes'].append({'name':'Cuff fastening buttons (2)','mesh':mesh_id})
parent=doc['nodes'][1];parent.setdefault('children',[]).append(node_id)
doc['buffers'][0]['byteLength']=len(newbin)
assert raw[binstart:binstart+len(geo_prefix)]==geo_prefix
jchunk=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();jchunk+=b' '*((4-len(jchunk)%4)%4);binpad=newbin+pad(newbin)
chunks=struct.pack('<I4s',len(jchunk),b'JSON')+jchunk+struct.pack('<I4s',len(binpad),b'BIN\0')+binpad
out.write_bytes(struct.pack('<4sII',b'glTF',2,12+len(chunks))+chunks)
result={'parentSha256':EXPECTED,'derivedSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'derivedBytes':out.stat().st_size,'originalGeometryBufferSha256':hashlib.sha256(geo_prefix).hexdigest(),'derivedOriginalGeometryPrefixSha256':hashlib.sha256(newbin[:len(geo_prefix)]).hexdigest(),'oldGeometryBytesPreserved':newbin[:len(geo_prefix)]==geo_prefix,'addedFasteners':buttons,'newButtonVertices':len(positions),'newButtonTriangles':len(indices)//3,'newMeshIndex':mesh_id,'newNodeIndex':node_id,'sourceMeshCount':len(doc['meshes'])-1,'derivedMeshCount':len(doc['meshes']),'sourceTextureCount':0,'derivedTextureCount':len(doc.get('textures',[]))}
assert result['oldGeometryBytesPreserved'] and result['sourceTextureCount']==result['derivedTextureCount']==0
Path(__file__).with_name('geometry-delta-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
