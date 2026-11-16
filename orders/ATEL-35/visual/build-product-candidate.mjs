import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readGlb,writeGlb} from '../../../tools/showcase-glb.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const files={
  garment:'orders/ATEL-35/v0.5/designer/garment-v0_5.glb',
  shape:'orders/ATEL-35/v0.5/independent-shape-review.json',
  provenance:'orders/ATEL-35/v0.5/designer/source-uv-provenance.json',
  material:'orders/ATEL-35/material/pbr-preset-v1.json',
  artwork:'orders/ATEL-35/research/artwork/atel35-chest-flower-v1.svg',
  output:'orders/ATEL-35/visual/garment-v1-cream-flower.glb',
  texture:'orders/ATEL-35/visual/atel35-v1-basecolor.png',
  profile:'orders/ATEL-35/visual/placement-profile-v1.json',
};
const full=p=>path.join(root,p);
const hash=p=>createHash('sha256').update(fs.readFileSync(full(p))).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(full(p),'utf8'));
const shape=read(files.shape),provenance=read(files.provenance),material=read(files.material);
if(shape.decision!=='pass'||shape.revision!=='v0.5-gray')throw Error('Independent v0.5 shape review is not pass');
if(hash(files.garment)!==shape.garment.sha256)throw Error('v0.5 GLB hash differs from independent shape review');
if(hash(files.provenance)!==shape.sourceProvenance.sha256)throw Error('Provenance hash differs from independent shape review');
if(hash(files.artwork)!=='0da8270ea729589c1ae27142326abbcc358c866598c3307c1895cdaf1b78e363')throw Error('Original artwork hash changed');
if(hash(files.material)!=='5555b6b4b9fab4794b7d359eb11c79243e7eec63cc698e89cc4bbce7a87c79c9')throw Error('Material preset hash changed');

// The approved gray UV surface places wearer-left chest at U≈0.10,V≈1.77.
// The texture repeats at integer UV boundaries, so the equivalent tile center is (0.10,0.77).
const placement={center:{u:0.10,v:0.77},size:{width:0.052,height:0.068},placement:'wearer-left chest (viewer-right in the front view)',orientation:'upright',uvConvention:'Texture origin upper-left; garment front chest map verified from v0.5 TEXCOORD_0 and world-space vertices.',artworkPath:files.artwork,artworkSha256:hash(files.artwork)};
const size=2048,box={x:Math.round((placement.center.u-placement.size.width/2)*size),y:Math.round((placement.center.v-placement.size.height/2)*size),w:Math.round(placement.size.width*size),h:Math.round(placement.size.height*size)};
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let png;
try{
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  const svg=fs.readFileSync(full(files.artwork),'utf8');
  const data=`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  png=await page.evaluate(async ({data,size,box,color})=>{
    const image=new Image();image.src=data;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle=color;ctx.fillRect(0,0,size,size);ctx.drawImage(image,box.x,box.y,box.w,box.h);
    return canvas.toDataURL('image/png').split(',')[1];
  },{data,size,box,color:material.appearance.baseColorHexSRGB});
  await page.close();
}finally{await browser.close();}
fs.writeFileSync(full(files.texture),Buffer.from(png,'base64'));

const doc=readGlb(full(files.garment));
for(const mesh of doc.g.meshes)for(const primitive of mesh.primitives){
  if(primitive.attributes.TEXCOORD_0===undefined)throw Error('All garment primitives need TEXCOORD_0');
  if(primitive.material!==0)throw Error('Unexpected source material slot; stop for review');
}
const texBytes=fs.readFileSync(full(files.texture));
const offset=(doc.bin.length+3)&~3;
doc.bin=Buffer.concat([doc.bin,Buffer.alloc(offset-doc.bin.length),texBytes]);
doc.g.bufferViews||=[];doc.g.images||=[];doc.g.samplers||=[];doc.g.textures||=[];
const view=doc.g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:texBytes.length})-1;
const image=doc.g.images.push({name:'ATEL-35 original flower on cream base-color',bufferView:view,mimeType:'image/png'})-1;
const sampler=doc.g.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497})-1;
const texture=doc.g.textures.push({name:'ATEL-35 cream + chest flower',sampler,source:image})-1;
doc.g.materials[0]={...doc.g.materials[0],name:'ATEL-35 simulated cotton-like cream with original chest flower',pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],baseColorTexture:{index:texture,texCoord:0},metallicFactor:material.appearance.metallicFactor,roughnessFactor:material.appearance.roughnessFactor},alphaMode:'OPAQUE'};
const creamMaterial=doc.g.materials.push({name:'ATEL-35 simulated cotton-like cream only (no artwork)',pbrMetallicRoughness:{baseColorFactor:material.appearance.baseColorFactorLinear,metallicFactor:material.appearance.metallicFactor,roughnessFactor:material.appearance.roughnessFactor},alphaMode:'OPAQUE'})-1;
// The source's back UV island overlaps the front chest tile. Keep all geometry
// and UVs exact; use its existing primitive/material boundaries to prevent a
// chest-only print from appearing on the back or trim.
for(let meshIndex=0;meshIndex<doc.g.meshes.length;meshIndex++)for(const primitive of doc.g.meshes[meshIndex].primitives)primitive.material=[1,2].includes(meshIndex)?0:creamMaterial;
fs.mkdirSync(path.dirname(full(files.output)),{recursive:true});writeGlb(full(files.output),doc);
const surfaceMapping={flowerMaterialMeshes:[1,2],creamOnlyMeshes:[0,3],reason:'Source UV chest tile overlaps the back island. Separate materials at existing primitive boundaries keep artwork front-only without changing geometry or UVs.'};
fs.writeFileSync(full(files.profile),JSON.stringify({orderId:'ATEL-35',revision:'v1',sourceShape:{path:files.garment,sha256:hash(files.garment),shapeReview:files.shape,shapeReviewSha256:hash(files.shape)},material:{path:files.material,sha256:hash(files.material),name:material.materialName,baseColorHexSRGB:material.appearance.baseColorHexSRGB,roughnessFactor:material.appearance.roughnessFactor,metallicFactor:material.appearance.metallicFactor,source:material.source.provenance},placement,surfaceMapping,artwork:{path:files.artwork,sha256:hash(files.artwork),texturePath:files.texture,textureSha256:hash(files.texture)},integratedGarment:{path:files.output,sha256:hash(files.output)},geometryChanged:false,uvChanged:false},null,2)+'\n');
console.log(JSON.stringify({integratedGarment:files.output,sha256:hash(files.output),texture:files.texture,textureSha256:hash(files.texture),textureBytes:fs.statSync(full(files.texture)).size,placement,surfaceMapping,shapeReview:shape.decision,sourceShapeSha256:shape.garment.sha256},null,2));
