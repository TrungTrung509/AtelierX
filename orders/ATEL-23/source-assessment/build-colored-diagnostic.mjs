import fs from 'node:fs';
const src='quality/candidates/user-supplied/white_shirt_black_leather_skirt_outfit.glb';
const dest='showcase/quality-preview/atel32-source-map/assets/components.glb';
const b=fs.readFileSync(src),jl=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+jl)),jo=20+jl,bl=b.readUInt32LE(jo),bin=b.subarray(jo+8,jo+8+bl);
const colors=[[0.95,.18,.15,1],[.15,.75,.25,1],[.15,.38,.95,1],[.98,.77,.12,1],[.75,.20,.88,1],[.12,.78,.78,1],[1,.43,.10,1],[.45,.28,.9,1],[.68,.85,.12,1],[.12,.46,.43,1],[1,.55,.68,1],[.65,.42,.15,1],[.35,.72,.95,1]];
const materialOffset=g.materials.length;for(let i=0;i<colors.length;i++)g.materials.push({name:`DIAGNOSTIC_MESH_${i}`,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:colors[i],metallicFactor:0,roughnessFactor:.72}});
for(const node of g.nodes)if(node.mesh!==undefined){const mesh=g.meshes[node.mesh];for(const pr of mesh.primitives)pr.material=materialOffset+node.mesh}
const parent=g.nodes.length;g.nodes.push({name:'Source-to-meter diagnostic scale',children:[0],scale:[.001,.001,.001]});g.scenes[g.scene||0].nodes=[parent];g.buffers[0].byteLength=bin.length;
const pad=(x,v=0)=>{const r=(4-x.length%4)%4;return r?Buffer.concat([x,Buffer.alloc(r,v)]):x},jb=pad(Buffer.from(JSON.stringify(g)),0x20),bb=pad(bin),head=Buffer.alloc(12);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(12+8+jb.length+8+bb.length,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(jb.length);jh.write('JSON',4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bb.length);bh.write('BIN\0',4);fs.writeFileSync(dest,Buffer.concat([head,jh,jb,bh,bb]));console.log(JSON.stringify({dest,bytes:fs.statSync(dest).size,meshes:g.meshes.length,diagnosticMaterials:colors.length},null,2));
