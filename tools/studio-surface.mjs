import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {inside,sha} from './studio-base.mjs';
import {readGlb,writeGlb} from './showcase-glb.mjs';
export function applySurface(doc,png,material,profile){
  const mapping=profile.surfaceMapping;
  if(!Array.isArray(mapping?.flowerMaterialMeshes)||!Array.isArray(mapping?.creamOnlyMeshes))throw Error('Cần mapping mesh trước/sau đã kiểm');
  const selected=new Set(mapping.flowerMaterialMeshes),plain=new Set(mapping.creamOnlyMeshes);
  for(let i=0;i<doc.g.meshes.length;i++)if(selected.has(i)===plain.has(i))throw Error('Mesh phải thuộc đúng một nhóm in hoặc trơn');
  const offset=(doc.bin.length+3)&~3;doc.bin=Buffer.concat([doc.bin,Buffer.alloc(offset-doc.bin.length),png]);
  doc.g.bufferViews||=[];doc.g.images||=[];doc.g.samplers||=[];doc.g.textures||=[];doc.g.materials||=[];
  const bufferView=doc.g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:png.length})-1;
  const source=doc.g.images.push({bufferView,mimeType:'image/png'})-1;
  const sampler=doc.g.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497})-1;
  const index=doc.g.textures.push({source,sampler})-1;
  const pbr={metallicFactor:material.appearance.metallicFactor,roughnessFactor:material.appearance.roughnessFactor};
  const printed=doc.g.materials.push({name:'Printed surface',pbrMetallicRoughness:{...pbr,baseColorFactor:[1,1,1,1],baseColorTexture:{index,texCoord:0}},alphaMode:'OPAQUE'})-1;
  const solid=doc.g.materials.push({name:'Plain surface',pbrMetallicRoughness:{...pbr,baseColorFactor:material.appearance.baseColorFactorLinear},alphaMode:'OPAQUE'})-1;
  doc.g.meshes.forEach((mesh,i)=>mesh.primitives.forEach(p=>{if(p.attributes.TEXCOORD_0===undefined)throw Error('Mesh thiếu UV');p.material=selected.has(i)?printed:solid}));
  return doc;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const job=JSON.parse(fs.readFileSync(inside(process.argv[2]),'utf8'));
  if(!/^ATEL-\d+$/.test(job.orderId)||!/^v[\w.-]+$/.test(job.revision))throw Error('Sai đơn/revision');
  const profile=JSON.parse(fs.readFileSync(inside(job.placementProfile),'utf8'));
  const material=JSON.parse(fs.readFileSync(inside(job.material),'utf8'));
  if(sha(inside(job.garment))!==job.garmentSha256)throw Error('Geometry khác phom đã chọn');
  const outputDir=`orders/${job.orderId}/${job.revision}/material`;fs.mkdirSync(inside(outputDir),{recursive:true});
  const {chromium}=createRequire('/usr/local/lib/node_modules/crewly/package.json')('playwright-core');
  const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  let png;
  try{
    const page=await browser.newPage(),svg=fs.readFileSync(inside(job.artwork),'utf8');
    png=await page.evaluate(async ({svg,color,p,size})=>{
      const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;const c=canvas.getContext('2d');c.fillStyle=color;c.fillRect(0,0,size,size);
      const image=new Image();image.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));await image.decode();
      c.drawImage(image,(p.center.u-p.size.width/2)*size,(p.center.v-p.size.height/2)*size,p.size.width*size,p.size.height*size);
      return canvas.toDataURL('image/png').split(',')[1];
    },{svg,color:material.appearance.baseColorHexSRGB,p:profile.placement,size:2048});
  }finally{await browser.close()}
  const texture=outputDir+'/basecolor.png',garment=outputDir+'/garment.glb';
  fs.writeFileSync(inside(texture),Buffer.from(png,'base64'));
  writeGlb(inside(garment),applySurface(readGlb(inside(job.garment)),Buffer.from(png,'base64'),material,profile));
  const manifest={orderId:job.orderId,revision:job.revision,geometryChanged:false,sourceGeometrySha256:job.garmentSha256,
    artifacts:[garment,texture,job.material,job.artwork,job.placementProfile].map(p=>({path:p,sha256:sha(inside(p))}))};
  fs.writeFileSync(inside(outputDir+'/surface.json'),JSON.stringify(manifest,null,2)+'\n');console.log(outputDir+'/surface.json');
}
