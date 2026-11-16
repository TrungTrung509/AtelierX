"""Measure GLB triangles after every node transform; export normalized display asset.
All lengths are model units, normalized to a declared 1.80 m studio reference.
"""
import json, struct, math, hashlib
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'quality/candidates/mannequin/mannequin-model-v1.glb'
OUT = ROOT / 'quality/evidence/mannequin-v1'
OUT.mkdir(parents=True, exist_ok=True)
data = SOURCE.read_bytes()
assert data[:4] == b'glTF' and struct.unpack_from('<I',data,4)[0] == 2
length = struct.unpack_from('<I',data,12)[0]
doc = json.loads(data[20:20+length])
binary = data[28+length:]
I = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
def mul(a,b): return [sum(a[k*4+r]*b[c*4+k] for k in range(4)) for c in range(4) for r in range(4)]
def transform(m,p): return [sum(m[k*4+r]*p[k] for k in range(3))+m[12+r] for r in range(3)]
def matrix(n):
    if 'matrix' in n: return n['matrix']
    x,y,z,w=n.get('rotation',[0,0,0,1]); sx,sy,sz=n.get('scale',[1,1,1]); tx,ty,tz=n.get('translation',[0,0,0])
    return [(1-2*y*y-2*z*z)*sx,(2*x*y+2*z*w)*sx,(2*x*z-2*y*w)*sx,0,(2*x*y-2*z*w)*sy,(1-2*x*x-2*z*z)*sy,(2*y*z+2*x*w)*sy,0,(2*x*z+2*y*w)*sz,(2*y*z-2*x*w)*sz,(1-2*x*x-2*y*y)*sz,0,tx,ty,tz,1]
def accessor(index):
    a=doc['accessors'][index]; v=doc['bufferViews'][a['bufferView']]
    fmt={5126:'f',5125:'I',5123:'H',5121:'B'}[a['componentType']]; count={'SCALAR':1,'VEC3':3}[a['type']]
    offset=v.get('byteOffset',0)+a.get('byteOffset',0); stride=v.get('byteStride',struct.calcsize('<'+fmt)*count)
    return [struct.unpack_from('<'+fmt*count,binary,offset+i*stride) for i in range(a['count'])]
points=[]; triangles=[]
def visit(index,parent):
    n=doc['nodes'][index]; m=mul(parent,matrix(n))
    if 'mesh' in n:
        for p in doc['meshes'][n['mesh']]['primitives']:
            assert p.get('mode',4)==4
            vertices=[transform(m,v) for v in accessor(p['attributes']['POSITION'])]; base=len(points); points.extend(vertices)
            ids=[v[0] for v in accessor(p['indices'])] if 'indices' in p else list(range(len(vertices)))
            triangles.extend(tuple(base+ids[i+k] for k in range(3)) for i in range(0,len(ids),3))
    for child in n.get('children',[]): visit(child,m)
for node in doc['scenes'][doc.get('scene',0)]['nodes']: visit(node,I)
lo=[min(p[k] for p in points) for k in range(3)]; hi=[max(p[k] for p in points) for k in range(3)]
scale=1.8/(hi[1]-lo[1]); center=[(lo[0]+hi[0])/2,lo[1],(lo[2]+hi[2])/2]
points=[[(p[k]-center[k])*scale for k in range(3)] for p in points]
def section(y,axis=1):
    segments=[]
    for ids in triangles:
        t=[points[i] for i in ids]; hits=[]
        for a,b in zip(t,t[1:]+t[:1]):
            if (a[axis]<y<=b[axis]) or (b[axis]<y<=a[axis]):
                f=(y-a[axis])/(b[axis]-a[axis]); hits.append(tuple(a[k]+f*(b[k]-a[k]) for k in range(3) if k!=axis))
        if len(hits)==2: segments.append(hits)
    return segments
# Connected section contours, torso selected by containing x=0 and closest x center.
def contours(y):
    seg=section(y); graph={}; positions={}
    for a,b in seg:
        ka=tuple(round(v,5) for v in a); kb=tuple(round(v,5) for v in b)
        if ka==kb: continue
        graph.setdefault(ka,set()).add(kb);graph.setdefault(kb,set()).add(ka); positions[ka]=a; positions[kb]=b
    groups=[]; seen=set()
    for start in graph:
        if start in seen: continue
        stack=[start]; group=[]
        while stack:
            k=stack.pop()
            if k in seen: continue
            seen.add(k);group.append(k);stack.extend(graph[k]-seen)
        ps=[positions[k] for k in group]; edges={(min(k,b),max(k,b)) for k in group for b in graph[k]}
        groups.append({'xmin':min(p[0] for p in ps),'xmax':max(p[0] for p in ps),'zmin':min(p[1] for p in ps),'zmax':max(p[1] for p in ps),'perimeter':sum(math.dist(positions[a],positions[b]) for a,b in edges),'closed':all(len(graph[k])==2 for k in group)})
    return sorted(groups,key=lambda g:abs((g['xmin']+g['xmax'])/2))
bands=[]
for i in range(1,180):
    y=i/100; groups=contours(y); torso=next((g for g in groups if g['xmin']<0<g['xmax']),None)
    if torso: bands.append({'y':y,**torso,'width':torso['xmax']-torso['xmin'],'depth':torso['zmax']-torso['zmin']})
report={'sourceSha256':hashlib.sha256(data).hexdigest(),'sourceWorldBounds':{'min':lo,'max':hi},'referenceHeightMeters':1.8,'scale':scale,'translation':[-c*scale for c in center],'vertices':len(points),'triangles':len(triangles),'boundsMeters':{'min':[min(p[k] for p in points) for k in range(3)],'max':[max(p[k] for p in points) for k in range(3)]},'sections':bands}
report['torsoStations']={name:next(s for s in bands if abs(s['y']-height)<0.001) for name,height in [('chest',1.37),('waist',1.18),('hip',0.94),('neck',1.57)]}
report['armStations']={}
for name,x in [('shoulder',0.25),('upperArm',0.34),('elbow',0.53),('wrist',0.73)]:
    for side,sign in [('positiveX',1),('negativeX',-1)]:
        segments=[seg for seg in section(x*sign,0) if min(p[0] for p in seg)>1.25]
        ps=[p for seg in segments for p in seg]
        report['armStations'][f'{side}_{name}']={'x':x*sign,'yCenter':(min(p[0] for p in ps)+max(p[0] for p in ps))/2,'zCenter':(min(p[1] for p in ps)+max(p[1] for p in ps))/2,'height':max(p[0] for p in ps)-min(p[0] for p in ps),'depth':max(p[1] for p in ps)-min(p[1] for p in ps),'perimeter':sum(math.dist(a,b) for a,b in segments),'method':'section at approximate anatomical x station; not rig joint'}
(OUT/'measurements.json').write_text(json.dumps(report,indent=2),encoding='utf8')
# Bake normalized positions into a single static mesh; source stays intact.
positions=b''.join(struct.pack('<fff',*p) for p in points); indices=b''.join(struct.pack('<III',*t) for t in triangles)
normals=[[0.,0.,0.] for p in points]
for ia,ib,ic in triangles:
    a,b,c=points[ia],points[ib],points[ic]; u=[b[k]-a[k] for k in range(3)]; v=[c[k]-a[k] for k in range(3)]
    n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
    for i in (ia,ib,ic):
        for k in range(3): normals[i][k]+=n[k]
normal_bytes=b''.join(struct.pack('<fff',*(v/(math.sqrt(sum(t*t for t in n)) or 1) for v in n)) for n in normals)
blob=positions+indices+normal_bytes
normalized={'asset':{'version':'2.0','generator':'AtelierX measure-mannequin.py','extras':doc['asset'].get('extras',{})},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'name':'AtelierX_man mannequin_180cm'.replace('man mannequin','mannequin'),'mesh':0}],'meshes':[{'primitives':[{'attributes':{'POSITION':0},'indices':1,'material':0}]}],'materials':[{'name':'mannequin-neutral','doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[0.65,0.68,0.71,1],'metallicFactor':0,'roughnessFactor':0.65}}],'buffers':[{'byteLength':len(blob)}],'bufferViews':[{'buffer':0,'byteOffset':0,'byteLength':len(positions),'target':34962},{'buffer':0,'byteOffset':len(positions),'byteLength':len(indices),'target':34963}],'accessors':[{'bufferView':0,'componentType':5126,'count':len(points),'type':'VEC3','min':report['boundsMeters']['min'],'max':report['boundsMeters']['max']},{'bufferView':1,'componentType':5125,'count':len(triangles)*3,'type':'SCALAR'}]}
normalized['meshes'][0]['primitives'][0]['attributes']['NORMAL']=2
normalized['bufferViews'].append({'buffer':0,'byteOffset':len(positions)+len(indices),'byteLength':len(normal_bytes),'target':34962})
normalized['accessors'].append({'bufferView':2,'componentType':5126,'count':len(points),'type':'VEC3'})
j=json.dumps(normalized,separators=(',',':')).encode(); j+=b' '*((-len(j))%4); blob+=b'\0'*((-len(blob))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
dest=ROOT/'quality/candidates/mannequin/mannequin-180cm-v1.glb';dest.write_bytes(glb)
report['normalizedSha256']=hashlib.sha256(glb).hexdigest();(OUT/'measurements.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps({k:v for k,v in report.items() if k not in ('sections','torsoStations','armStations')},indent=2))
