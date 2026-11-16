import fs from 'node:fs';
const basePath='quality/candidates/mannequin/mannequin-180cm-v1.glb',garmentPath='orders/ATEL-23/v3.1/designer/garment-v3_1.glb',outPath='orders/ATEL-23/v3.1/fit-evidence/garment-on-mannequin-v3_1.glb';
function read(p){const b=fs.readFileSync(p);if(b.toString('ascii',0,4)!=='glTF')throw Error(`Invalid GLB ${p}`);const n=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+n)),lenOff=20+n,start=lenOff+8,bin=b.subarray(start,start+b.readUInt32LE(lenOff));return{g,bin}}
const a=read(basePath),c=read(garmentPath),g=structuredClone(a.g),oldLen=a.bin.length,baseOff=(oldLen+3)&~3,bin=Buffer.concat([a.bin,Buffer.alloc(baseOff-oldLen),c.bin]);
const bvOffset=g.bufferViews.length,accOffset=g.accessors.length,meshOffset=g.meshes.length,nodeOffset=g.nodes.length,matOffset=g.materials.length;
for(const v of c.g.bufferViews||[])g.bufferViews.push({...v,buffer:0,byteOffset:baseOff+(v.byteOffset||0)});
for(const a0 of c.g.accessors||[])g.accessors.push({...a0,bufferView:a0.bufferView===undefined?undefined:a0.bufferView+bvOffset});
for(const m of c.g.materials||[])g.materials.push({...m,name:'ATEL-23 fit-preview contrast (display only)',pbrMetallicRoughness:{...(m.pbrMetallicRoughness||{}),baseColorFactor:[0.38,0.66,0.78,1]}});
for(const m0 of c.g.meshes||[])g.meshes.push({...m0,primitives:m0.primitives.map(pr=>({...pr,attributes:Object.fromEntries(Object.entries(pr.attributes).map(([k,v])=>[k,v+accOffset])),indices:pr.indices+accOffset,material:pr.material+matOffset}))});
for(const n0 of c.g.nodes||[])g.nodes.push({...n0,mesh:n0.mesh===undefined?undefined:n0.mesh+meshOffset,children:n0.children?.map(x=>x+nodeOffset)});
for(const s of g.scenes){const cs=c.g.scenes[c.g.scene||0];for(const n of cs.nodes||[])s.nodes.push(n+nodeOffset)}
g.buffers[0].byteLength=bin.length;
const js=Buffer.from(JSON.stringify(g)),pad=(b,value=0)=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4,value)]),jp=pad(js,0x20),bp=pad(bin,0),h=Buffer.alloc(12);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jp.length+8+bp.length,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(jp.length);jh.write('JSON',4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bp.length);bh.write('BIN\0',4);fs.writeFileSync(outPath,Buffer.concat([h,jh,jp,bh,bp]));console.log(JSON.stringify({outPath,bytes:fs.statSync(outPath).size,nodes:g.nodes.length,meshes:g.meshes.length},null,2));
