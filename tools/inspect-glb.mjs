import fs from 'node:fs';
const data = fs.readFileSync(process.argv[2]);
if (data.toString('utf8',0,4) !== 'glTF') throw new Error('Không phải GLB');
const jsonLength = data.readUInt32LE(12);
const gltf = JSON.parse(data.toString('utf8',20,20+jsonLength));
console.log(JSON.stringify({
  nodes:gltf.nodes?.map((node,index)=>({index,name:node.name,mesh:node.mesh,children:node.children})),
  meshes:gltf.meshes?.map((mesh,index)=>({index,name:mesh.name,primitives:mesh.primitives?.map(p=>({material:p.material,attributes:Object.keys(p.attributes || {})}))})),
  materials:gltf.materials?.map((material,index)=>({index,name:material.name})),
  images:gltf.images?.length,animations:gltf.animations?.length,
  scenes:gltf.scenes
},null,2));
