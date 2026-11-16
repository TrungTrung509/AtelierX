import fs from 'node:fs';
import path from 'node:path';
const data=fs.readFileSync(process.argv[2]);
const out=process.argv[3];
const jsonLength=data.readUInt32LE(12);
const gltf=JSON.parse(data.toString('utf8',20,20+jsonLength));
const binStart=20+jsonLength+8;
fs.mkdirSync(out,{recursive:true});
for(let i=0;i<(gltf.images||[]).length;i++){
  const image=gltf.images[i];
  if(image.bufferView===undefined) continue;
  const view=gltf.bufferViews[image.bufferView];
  const ext=image.mimeType==='image/png'?'png':image.mimeType==='image/jpeg'?'jpg':'bin';
  const file=path.join(out,`${i}.${ext}`);
  fs.writeFileSync(file,data.subarray(binStart+(view.byteOffset||0),binStart+(view.byteOffset||0)+view.byteLength));
  console.log(file,image.name||'');
}
