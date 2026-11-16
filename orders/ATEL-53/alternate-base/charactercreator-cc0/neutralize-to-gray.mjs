import fs from 'node:fs';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('usage: node neutralize-to-gray.mjs input.glb output.glb');
const src=fs.readFileSync(input);
if(src.toString('ascii',0,4)!=='glTF'||src.readUInt32LE(4)!==2)throw Error('Expected GLB 2');
let offset=12,chunks=[];
while(offset<src.length){const length=src.readUInt32LE(offset),type=src.toString('ascii',offset+4,offset+8);chunks.push({type,data:src.subarray(offset+8,offset+8+length)});offset+=8+length;}
if(chunks[0]?.type!=='JSON'||!chunks.some(c=>c.type==='BIN\0'))throw Error('Missing GLB JSON/BIN chunk');
const jsonChunk=chunks[0],g=JSON.parse(jsonChunk.data.toString('utf8').trim());
for(const material of g.materials||[]){material.pbrMetallicRoughness||={};const p=material.pbrMetallicRoughness;delete p.baseColorTexture;p.baseColorFactor=[0.68,0.68,0.68,1];p.metallicFactor=0;p.roughnessFactor=0.84;}
const pad=(b,ch)=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4,ch)]);
chunks[0].data=pad(Buffer.from(JSON.stringify(g)),0x20);
const parts=[Buffer.from('glTF'),Buffer.alloc(8)];
for(const c of chunks){const head=Buffer.alloc(8);head.writeUInt32LE(c.data.length);head.write(c.type,4);parts.push(head,c.data);}
const result=Buffer.concat(parts);result.writeUInt32LE(2,4);result.writeUInt32LE(result.length,8);fs.writeFileSync(output,result);
console.log(JSON.stringify({output,bytes:result.length,materials:(g.materials||[]).length,geometryUnchanged:true}));
