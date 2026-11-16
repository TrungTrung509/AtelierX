#!/usr/bin/env python3
"""Create a uniform-gray derived GLB; preserve geometry buffer bytes exactly."""
import json, struct, hashlib
from pathlib import Path
src=Path(__file__).resolve().parents[3] / 'quality/candidates/user-supplied/shirt.glb'
out=Path(__file__).resolve().parent / 'shirt-gray-v1.1.glb'
b=src.read_bytes()
magic, version, total=struct.unpack_from('<4sII', b, 0)
assert magic==b'glTF' and version==2 and total==len(b)
json_len, json_type=struct.unpack_from('<I4s',b,12)
assert json_type==b'JSON'
doc=json.loads(b[20:20+json_len])
bin_pos=20+json_len
bin_len, bin_type=struct.unpack_from('<I4s',b,bin_pos)
assert bin_type==b'BIN\x00'
bin_start=bin_pos+8
bin_data=b[bin_start:bin_start+bin_len]
image_views={im['bufferView'] for im in doc.get('images',[]) if 'bufferView' in im}
used_geometry_views={}
# Existing inspection: views 0..2 are accessor/geometry data; image payloads are views 3,4.
for ai,a in enumerate(doc.get('accessors',[])):
    if 'bufferView' in a: used_geometry_views[a['bufferView']]=True
    if 'sparse' in a:
        for key in ('indices','values'):
            if 'bufferView' in a['sparse'][key]: used_geometry_views[a['sparse'][key]['bufferView']]=True
assert image_views.isdisjoint(used_geometry_views.keys()), 'Unexpected image/geometry bufferView overlap'
keep_views=sorted(used_geometry_views)
assert keep_views==[0,1,2], f'Unexpected source geometry bufferViews: {keep_views}'
# Geometry buffers occupy a contiguous prefix; preserve those bytes byte-for-byte.
geometry_end=max(doc['bufferViews'][i].get('byteOffset',0)+doc['bufferViews'][i]['byteLength'] for i in keep_views)
geometry_bytes=bin_data[:geometry_end]
for i,m in enumerate(doc.get('materials',[])):
    pbr=m.setdefault('pbrMetallicRoughness',{})
    pbr.pop('baseColorTexture',None)
    # Keep a restrained grayscale distinction between button geometry and cloth.
    gray=0.18 if i==0 else 0.36
    pbr['baseColorFactor']=[gray,gray,gray,1.0]
    pbr['metallicFactor']=0.0
    pbr['roughnessFactor']=0.82 if i==0 else 0.9
    for ext in ('KHR_materials_pbrSpecularGlossiness','KHR_materials_clearcoat','KHR_materials_sheen'):
        m.get('extensions',{}).pop(ext,None)
    if not m.get('extensions'): m.pop('extensions',None)
doc.pop('textures',None); doc.pop('images',None); doc.pop('samplers',None)
doc['bufferViews']=[doc['bufferViews'][i] for i in keep_views]
doc['buffers'][0]['byteLength']=len(geometry_bytes)
# No remaining accessor may reference a removed view.
assert all(a.get('bufferView',0) in range(len(doc['bufferViews'])) for a in doc.get('accessors',[]))
# Keep source asset metadata/extras verbatim and avoid editing meshes/nodes/accessors.
json_chunk=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode('utf-8')
json_chunk+=b' ' * ((-len(json_chunk))%4)
bin_chunk=geometry_bytes + b'\0' * ((-len(geometry_bytes))%4)
chunks=struct.pack('<I4s',len(json_chunk),b'JSON')+json_chunk+struct.pack('<I4s',len(bin_chunk),b'BIN\0')+bin_chunk
out.write_bytes(struct.pack('<4sII',b'glTF',2,12+len(chunks))+chunks)
# Structural/evidence facts for manifest generation.
result={
 'sourceSha256':hashlib.sha256(b).hexdigest(),'sourceBytes':len(b),
 'derivedSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'derivedBytes':out.stat().st_size,
 'geometryBufferViewsPreserved':keep_views,'geometryBinBytesPreserved':len(geometry_bytes),
 'sourceGeometryBufferSha256':hashlib.sha256(geometry_bytes).hexdigest(),
 'derivedGeometryBufferSha256':hashlib.sha256(bin_chunk[:len(geometry_bytes)]).hexdigest(),
 'sourceMeshCount':len(doc.get('meshes',[])),'sourceNodeCount':len(doc.get('nodes',[])),
 'remainingTextures':len(doc.get('textures',[])),'materials':doc['materials']
}
assert result['sourceGeometryBufferSha256']==result['derivedGeometryBufferSha256']
assert result['sourceSha256']=='1de5a29649bd5520bc5163660c40e58799f514c8cbb36cbbcd18611cc3c497d3'
print(json.dumps(result,indent=2))
