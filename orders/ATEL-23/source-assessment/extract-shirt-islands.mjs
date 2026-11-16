import fs from 'node:fs';
import crypto from 'node:crypto';
const src='quality/candidates/user-supplied/white_shirt_black_leather_skirt_outfit.glb';
const out='orders/ATEL-23/source-assessment/candidate-shirt-islands.glb';
const expected='48f2e9ba4694355b36c7148006c49af925c9002bd78b09cd28504d3dd0c0a93c';
const source=fs.readFileSync(src),sourceSha=crypto.createHash('sha256').update(source).digest('hex');if(sourceSha!==expected)throw Error(`source SHA mismatch ${sourceSha}`);
const jlen=source.readUInt32LE(12),g=JSON.parse(source.toString('utf8',20,20+jlen)),binStart=20+jlen+8,bin=source.subarray(binStart,binStart+source.readUInt32LE(20+jlen));
const map=JSON.parse(fs.readFileSync('quality/evidence/ATEL-32-source-assessment/island-map-all.json','utf8'));
const keepMeshes=[2,4,5,6,7,8,10,11,12];
const selected=new Map([[2,[0,1,2,3]],[4,[0,1,2,3,4,5]],[5,[0,1,2,3,4,5]],[6,[6,7]],[7,[0,1]],[8,[0,1]],[10,Array.from({length:28},(_,i)=>i)],[11,Array.from({length:14},(_,i)=>i+28)],[12,Array.from({length:14},(_,i)=>i)]]);
const componentTypes={5121:{size:1,write:(b,o,v)=>b.writeUInt8(v,o)},5123:{size:2,write:(b,o,v)=>b.writeUInt16LE(v,o)},5125:{size:4,write:(b,o,v)=>b.writeUInt32LE(v,o)}};
const append=[];let cursor=bin.length;
function pad4(b){const n=(4-b.length%4)%4;return n?Buffer.concat([b,Buffer.alloc(n)]):b}
for(const [mi,n] of selected){
 const prims=g.meshes[mi].primitives;if(prims.length!==1)throw Error(`mesh ${mi} has ${prims.length} primitives; review needed`);
 const p=prims[0],origIndex=p.indices;if(origIndex===undefined)throw Error(`mesh ${mi} has no explicit indices`);
 const a=g.accessors[origIndex],ct=componentTypes[a.componentType];if(!ct)throw Error('unsupported index component type');
 const groups=map.islands.filter(x=>x.meshIndex===mi);if(n.length===groups.length)continue;const indices=groups.filter(x=>n.includes(x.islandIndex)).flatMap(x=>x.trianglesIndex);
 const expectedTriangles=groups.filter(x=>n.includes(x.islandIndex)).reduce((s,x)=>s+x.triangles,0);
 if(indices.length!==expectedTriangles*3)throw Error(`island index count mismatch mesh ${mi}`);
 const packed=Buffer.alloc(indices.length*ct.size);indices.forEach((v,i)=>ct.write(packed,i*ct.size,v));
 cursor=(cursor+3)&~3;const offset=cursor;append.push({offset,data:packed});cursor+=packed.length;
 const bv=g.bufferViews.length;g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:packed.length});
 const ai=g.accessors.length;const min=Math.min(...indices),max=Math.max(...indices);g.accessors.push({bufferView:bv,byteOffset:0,componentType:a.componentType,count:indices.length,type:'SCALAR',min:[min],max:[max]});
 const cloned=structuredClone(g.meshes[mi]);cloned.name=`shirt-front-source-mesh-${mi}-selected-islands-${n.join('-')}`;cloned.primitives[0].indices=ai;const meshIndex=g.meshes.length;g.meshes.push(cloned);const nodeIndex=mi+2;if(g.nodes[nodeIndex].mesh!==mi)throw Error(`node ${nodeIndex} not expected to reference mesh ${mi}`);g.nodes[nodeIndex].mesh=meshIndex;
}
const selectedNodeIds=keepMeshes.map(i=>i+2);g.nodes[1].children=g.nodes[1].children.filter(i=>selectedNodeIds.includes(i));
const wrapper=g.nodes.length;g.nodes.push({name:'Source-to-meter transform (assessment candidate)',children:[0],scale:[.001,.001,.001]});g.scenes[g.scene||0].nodes=[wrapper];
const combined=Buffer.alloc(cursor);bin.copy(combined,0);for(const item of append)item.data.copy(combined,item.offset); // place appended index streams at their declared aligned offsets
if(combined.length!==cursor)throw Error(`binary length mismatch ${combined.length} != ${cursor}`);g.buffers[0].byteLength=combined.length;g.asset.extras={...(g.asset.extras||{}),atelierxDerivedCandidate:{sourceSha256:sourceSha,license:'CC-BY-4.0',sourceUrl:g.asset.extras?.source,selectedShirtMeshIndices:keepMeshes,selectedIslandIds:Object.fromEntries([...selected.entries()].map(([mi,islands])=>[`mesh-${mi}`,islands])),status:'candidate-only; not approved; no G1 claim'}};
const pad=(b,v=0)=>{const n=(4-b.length%4)%4;return n?Buffer.concat([b,Buffer.alloc(n,v)]):b};const jb=pad(Buffer.from(JSON.stringify(g)),0x20),bb=pad(combined),head=Buffer.alloc(12);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(12+8+jb.length+8+bb.length,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(jb.length);jh.write('JSON',4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bb.length);bh.write('BIN\0',4);const result=Buffer.concat([head,jh,jb,bh,bb]);fs.mkdirSync('orders/ATEL-23/source-assessment',{recursive:true});fs.writeFileSync(out,result);console.log(JSON.stringify({out,sourceSha256:sourceSha,derivedSha256:crypto.createHash('sha256').update(result).digest('hex'),bytes:result.length,keepMeshes,selectedIslands:Object.fromEntries([...selected.entries()].map(([mi,islands])=>[`mesh-${mi}`,islands])),selectedTriangleCounts:Object.fromEntries([...selected.entries()].map(([mi,islands])=>[mi,map.islands.filter(x=>x.meshIndex===mi&&islands.includes(x.islandIndex)).reduce((s,x)=>s+x.triangles,0)])),uv0:keepMeshes.every(i=>g.meshes[i].primitives.every(p=>p.attributes.TEXCOORD_0!==undefined))},null,2));
