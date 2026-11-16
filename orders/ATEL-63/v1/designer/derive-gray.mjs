import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {readGlb,writeGlb} from '../../../../tools/showcase-glb.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../');
const source='quality/candidates/user-supplied/sweater.glb';
const output='orders/ATEL-63/v1/designer/sweater-gray-v1.glb';
const sha=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const src=readGlb(path.join(root,source));
const sourceBinSha=createHash('sha256').update(src.bin).digest('hex');
const originalGeometry=JSON.stringify({nodes:src.g.nodes,meshes:src.g.meshes,accessors:src.g.accessors,bufferViews:src.g.bufferViews,buffers:src.g.buffers});

for(const material of src.g.materials||[]){
  material.name='Neutral gray knit shell';
  material.pbrMetallicRoughness={baseColorFactor:[0.30,0.31,0.32,1],metallicFactor:0,roughnessFactor:0.9};
  delete material.normalTexture;
  delete material.occlusionTexture;
  delete material.emissiveTexture;
  delete material.extensions;
  delete material.emissiveFactor;
}
src.g.images=[];
src.g.textures=[];
src.g.samplers=[];
src.g.extensionsUsed=(src.g.extensionsUsed||[]).filter(x=>!x.startsWith('KHR_materials_'));
src.g.extensionsRequired=(src.g.extensionsRequired||[]).filter(x=>!x.startsWith('KHR_materials_'));
src.g.asset.extras||={};
src.g.asset.extras.atelierxStandalone={
  orderId:'ATEL-63',revision:'sweater-v1-gray',status:'candidate for independent shape review; not QA-approved',
  derivedFrom:{path:source,sha256:sha(source),author:'Tristen',title:'Sweater',sourceUrl:'https://sketchfab.com/3d-models/sweater-03ec2c29e4dc497080b32951f3168754',license:'CC-BY-4.0 (embedded GLB metadata; project use additionally authorized by owner)'},
  operation:'Removed source color, normal, occlusion and roughness appearance maps; applied neutral matte gray for shape review. Preserved all source geometry, normals, tangents, UV coordinates, indices and scene transforms byte-for-byte.',
  materialGroups:(src.g.materials||[]).map((m,i)=>({sourceGroup:i,name:m.name,mesh:'defaultMaterial'})),
  uv:{attribute:'TEXCOORD_0',preserved:true,origin:'glTF UV coordinates; chest placement notes and measured region are recorded in the shape manifest.'}
};
const newGeometry=JSON.stringify({nodes:src.g.nodes,meshes:src.g.meshes,accessors:src.g.accessors,bufferViews:src.g.bufferViews,buffers:src.g.buffers});
if(originalGeometry!==newGeometry)throw Error('Geometry or UV structures changed unexpectedly');
if(createHash('sha256').update(src.bin).digest('hex')!==sourceBinSha)throw Error('Source binary buffer changed unexpectedly');
fs.mkdirSync(path.dirname(path.join(root,output)),{recursive:true});
writeGlb(path.join(root,output),src);
const derived=readGlb(path.join(root,output));
if(createHash('sha256').update(derived.bin).digest('hex')!==sourceBinSha)throw Error('Derived binary buffer differs from source');
console.log(JSON.stringify({source,sourceSha256:sha(source),sourceBinSha256:sourceBinSha,output,outputSha256:sha(output),bytes:fs.statSync(path.join(root,output)).size,geometryStructuresIdentical:true,binChunkUnchanged:true,materials:derived.g.materials.map(m=>m.name),textures:derived.g.textures.length,images:derived.g.images.length}));
