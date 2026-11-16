import struct,json,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[3]
src_path=root/'quality/candidates/user-supplied/shirt.glb'; der_path=Path(__file__).resolve().parent/'shirt-gray-v1.1.glb'
def read(path):
 b=path.read_bytes(); n=struct.unpack_from('<I',b,12)[0]; d=json.loads(b[20:20+n]); pos=20+n; bl=struct.unpack_from('<I',b,pos)[0]; start=pos+8; return b,d,b[start:start+bl]
sb,sd,sbin=read(src_path); db,dd,dbin=read(der_path)
checks={}
for key in ('meshes','nodes','accessors','scenes','scene','skins','animations','cameras'):
 checks[key+'_unchanged']=sd.get(key)==dd.get(key)
checks['geometryBufferPrefixByteIdentical']=sbin[:2023888]==dbin[:2023888]
checks['sourceGeometryBufferSha256']=hashlib.sha256(sbin[:2023888]).hexdigest()
checks['derivedGeometryBufferSha256']=hashlib.sha256(dbin[:2023888]).hexdigest()
checks['sourceNormalsAccessorIds']=[p['attributes']['NORMAL'] for m in sd['meshes'] for p in m['primitives'] if 'NORMAL' in p.get('attributes',{})]
checks['derivedNormalsAccessorIds']=[p['attributes']['NORMAL'] for m in dd['meshes'] for p in m['primitives'] if 'NORMAL' in p.get('attributes',{})]
checks['uvAccessorIds']=[p['attributes']['TEXCOORD_0'] for m in sd['meshes'] for p in m['primitives'] if 'TEXCOORD_0' in p.get('attributes',{})]
checks['sourceMeshes']=len(sd.get('meshes',[])); checks['sourceNodes']=len(sd.get('nodes',[])); checks['sourceSkins']=len(sd.get('skins',[])); checks['sourceTextures']=len(sd.get('textures',[])); checks['derivedTextures']=len(dd.get('textures',[]))
checks['passed']=all(checks[k] for k in ('meshes_unchanged','nodes_unchanged','accessors_unchanged','scenes_unchanged','scene_unchanged','skins_unchanged','animations_unchanged','cameras_unchanged','geometryBufferPrefixByteIdentical')) and checks['sourceNormalsAccessorIds']==checks['derivedNormalsAccessorIds'] and checks['sourceGeometryBufferSha256']==checks['derivedGeometryBufferSha256'] and checks['derivedTextures']==0
assert checks['passed'],checks
Path(__file__).with_name('geometry-preservation-check.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
