import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readGlb,writeGlb} from '../../../../tools/showcase-glb.mjs';
import {sha} from '../../../../tools/studio-base.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const inside=p=>path.resolve(root,p);
const input='orders/ATEL-47/v4/designer/garment-gray-v4.glb';
const shape='orders/ATEL-47/v4/shape.json';
const review='orders/ATEL-47/v4/shape-review-handoff.json';
const provenance='orders/ATEL-47/v4/designer/provenance-v4.json';
const placement='orders/ATEL-47/v4/designer/placement-v4.md';
const preset='orders/ATEL-47/material/pbr-preset-v1.json';
const outDir='orders/ATEL-47/v4/material';
const out=outDir+'/garment-surface-v4.glb';
if(sha(inside(input))!=='493dfca00032176e3cc3178d46ce7ebf5113c9b6c765befdc4b6b2202aa2bccc')throw Error('Gray garment hash mismatch');
const shapeData=JSON.parse(fs.readFileSync(inside(shape),'utf8'));
const reviewData=JSON.parse(fs.readFileSync(inside(review),'utf8'));
const prov=JSON.parse(fs.readFileSync(inside(provenance),'utf8'));
if(shapeData.revision!=='v4'||reviewData.revision!=='v4'||reviewData.decision!=='pass')throw Error('Shape review is not passed for v4');
if(prov.garment.sha256!==shapeData.garment.sha256||!prov.uv.frontBackPanels.includes('U left-to-right'))throw Error('Unexpected geometry or UV contract');
const material=JSON.parse(fs.readFileSync(inside(preset),'utf8'));
if(material.appearance.baseColorHexSRGB!=='#79BCEB'||material.stripeSpec.colorHexSRGB!=='#F8FBFF')throw Error('Preset does not match brief');

// A body panel spans U=0..1 left-to-right. Place 12 centered stripe repeats
// symmetrically around U=.5, away from the UV seam; width is 0.006 UV.
const {chromium}=createRequire('/usr/local/lib/node_modules/crewly/package.json')('playwright-core');
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let png;
try{
  const page=await browser.newPage();
  png=await page.evaluate(({base,white})=>{
    const size=2048,c=document.createElement('canvas');c.width=size;c.height=size;
    const ctx=c.getContext('2d');ctx.fillStyle=base;ctx.fillRect(0,0,size,size);ctx.fillStyle=white;
    const repeat=1/12,width=.006;
    for(let i=0;i<12;i++){
      const u=(i+.5)*repeat;
      if(u<0||u>1)continue;
      // Leave the shoulder/yoke boundary clean; body stripes begin below it.
      ctx.fillRect(Math.round((u-width/2)*size),Math.round(size*.065),Math.max(1,Math.round(width*size)),Math.ceil(size*.935));
    }
    return c.toDataURL('image/png').split(',')[1];
  },{base:material.appearance.baseColorHexSRGB,white:material.stripeSpec.colorHexSRGB});
}finally{await browser.close()}

const image=Buffer.from(png,'base64');
fs.mkdirSync(inside(outDir),{recursive:true});
fs.writeFileSync(inside(outDir+'/basecolor-pinstripe-v4.png'),image);
const doc=readGlb(inside(input));
const originalPositions=JSON.stringify(doc.g.accessors.filter(a=>a.type==='VEC3'&&a.componentType===5126).map(a=>[a.count,a.min,a.max]));
const originalMeshCount=doc.g.meshes.length;
const imageOffset=(doc.bin.length+3)&~3;doc.bin=Buffer.concat([doc.bin,Buffer.alloc(imageOffset-doc.bin.length),image]);
doc.g.bufferViews||=[];doc.g.images||=[];doc.g.samplers||=[];doc.g.textures||=[];
const bufferView=doc.g.bufferViews.push({buffer:0,byteOffset:imageOffset,byteLength:image.length})-1;
const source=doc.g.images.push({bufferView,mimeType:'image/png',name:'ATEL-47 white pinstripe on sky blue'})-1;
const sampler=doc.g.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497})-1;
const texture=doc.g.textures.push({source,sampler,name:'ATEL-47 body pinstripe'})-1;
const old=doc.g.materials;
const mk=(name,color,rough=.82,textureIndex)=>({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:textureIndex===undefined?color:[1,1,1,1],metallicFactor:0,roughnessFactor:rough,...(textureIndex===undefined?{}:{baseColorTexture:{index:textureIndex,texCoord:0}})}});
const colors=old.map((m,i)=>i===5?(m.pbrMetallicRoughness?.baseColorFactor||[.14,.15,.16,1]):material.appearance.baseColorFactorLinear);
const materials=old.map((m,i)=>mk(`ATEL-47 v4 solid ${m.name.replace(/^Neutral gray /,'')}`,colors[i],i===5?.72:.82));
materials.push(mk('ATEL-47 v4 striped cotton-poplin body',material.appearance.baseColorFactorLinear,.82,texture));
doc.g.materials=materials;
for(let i=0;i<doc.g.meshes.length;i++){
  const mesh=doc.g.meshes[i];
  const body=i===0||i===1;
  if(body&&!/^(Front|Back) body panel$/.test(mesh.name))throw Error(`Unexpected body mesh ${mesh.name}`);
  for(const p of mesh.primitives){
    if(p.attributes.TEXCOORD_0===undefined)throw Error(`${mesh.name} missing UV`);
    p.material=body?materials.length-1:(p.material===undefined?0:p.material);
  }
}
if(doc.g.meshes.length!==originalMeshCount||JSON.stringify(doc.g.accessors.filter(a=>a.type==='VEC3'&&a.componentType===5126).map(a=>[a.count,a.min,a.max]))!==originalPositions)throw Error('Geometry accessor data changed');
writeGlb(inside(out),doc);
const manifest={orderId:'ATEL-47',revision:'v4',geometryChanged:false,shapeReview:{path:review,sha256:sha(inside(review)),decision:'pass'},sourceGeometry:{path:input,sha256:sha(inside(input))},surface:{path:out,sha256:sha(inside(out))},texture:{path:outDir+'/basecolor-pinstripe-v4.png',sha256:sha(inside(outDir+'/basecolor-pinstripe-v4.png'))},preset:{path:preset,sha256:sha(inside(preset))},placement:{path:placement,sha256:sha(inside(placement))},provenance:{path:provenance,sha256:sha(inside(provenance))},pattern:{stripeCountPerPanel:12,repeatUv:1/12,widthUv:.006,orientation:'vertical, parallel to centerline',panels:['Front body panel','Back body panel'],solidTrim:['Shoulder yokes','Neckline facing','Collar stand and leaves','Sleeves and root closures','Cuffs','Front placket','Buttons']},material:{simulatedMaterial:material.appearance.simulatedMaterial,baseColorHexSRGB:material.appearance.baseColorHexSRGB,stripeColorHexSRGB:material.stripeSpec.colorHexSRGB,roughnessFactor:.82,metallicFactor:0},evidence:{geometryAccessorsPreserved:true,bodyMeshesTextured:['Front body panel','Back body panel'],allOtherMeshesSolid:true},artifacts:[out,outDir+'/basecolor-pinstripe-v4.png',preset,placement,provenance].map(p=>({path:p,sha256:sha(inside(p))}))};
fs.writeFileSync(inside(outDir+'/surface-manifest-v4.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({surface:out,manifest:outDir+'/surface-manifest-v4.json',sha256:manifest.surface.sha256,texture:manifest.texture.path},null,2));
