import fs from 'node:fs';
import {createRequire} from 'node:module';
import {accessor, readGlb, writeGlb} from '../../../tools/showcase-glb.mjs';
import {inside, sha} from '../../../tools/studio-base.mjs';

const require = createRequire('/usr/local/lib/node_modules/crewly/package.json');
const sharp = require('sharp');
const jobPath = process.argv[2] || 'orders/ATEL-53/material/surface-job-owner-shirt-v1.2.json';
const job = JSON.parse(fs.readFileSync(inside(jobPath), 'utf8'));
const preset = JSON.parse(fs.readFileSync(inside(job.material), 'utf8'));
const profile = JSON.parse(fs.readFileSync(inside(job.placementProfile), 'utf8'));
const sourcePath = inside(job.garment);
if (sha(sourcePath) !== job.garmentSha256 || preset.sourceGeometry.sha256 !== job.garmentSha256 || profile.sourceGeometry.sha256 !== job.garmentSha256) {
  throw new Error('Source geometry SHA does not match the approved v1.2 handoff');
}
const artwork = fs.readFileSync(inside(job.artwork), 'utf8');
const svgColors = [...artwork.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map(m => m[1].toUpperCase());
if (!svgColors.includes(preset.appearance.baseColorHexSRGB.toUpperCase()) || !svgColors.includes(preset.stripeSpec.colorHexSRGB.toUpperCase())) throw new Error('Pinstripe artwork colors do not match the preset');

const doc = readGlb(sourcePath);
const sourceBin = Buffer.from(doc.bin);
const sourceBufferSha256 = shaBuffer(sourceBin);
const fabricMeshes = profile.surfaceMapping.fabricMeshes;
const buttonMeshes = profile.surfaceMapping.buttonMeshes;
const all = [...fabricMeshes, ...buttonMeshes].sort((a,b)=>a-b);
if (new Set(all).size !== all.length || all.join(',') !== doc.g.meshes.map((_,i)=>i).join(',')) throw new Error('Placement profile must partition every source mesh exactly once');
const size = profile.textureRaster.width;
if (size !== profile.textureRaster.height || size < 1024 || size > 4096) throw new Error('Expected square texture between 1024 and 4096 pixels');
const background = hexRgb(preset.appearance.baseColorHexSRGB);
const stripe = hexRgb(preset.stripeSpec.colorHexSRGB);
const lineWidthRatio = preset.stripeSpec.lineWidthRatio;
const profiles = new Map(profile.fabricMeshProfiles.map(x=>[x.mesh,x]));
if (fabricMeshes.some(i=>!profiles.has(i))) throw new Error('Every fabric mesh needs a UV stripe profile');

doc.g.images ||= []; doc.g.samplers ||= []; doc.g.textures ||= []; doc.g.materials ||= [];
const sampler = doc.g.samplers.push({magFilter:9729,minFilter:9987,wrapS:33071,wrapT:33071})-1;
const textureRecords=[];
const textureBuffers=new Map();
for (const meshIndex of fabricMeshes) {
  const meshProfile=profiles.get(meshIndex);
  const mesh=doc.g.meshes[meshIndex];
  for (const primitive of mesh.primitives) if (primitive.attributes.TEXCOORD_0===undefined) throw new Error(`Fabric mesh ${meshIndex} lacks TEXCOORD_0`);
  // Bake straight, repeatable stripes in U and garment length in V. Each mesh
  // has an independent atlas so overlapping source UV islands cannot overwrite.
  const raw=Buffer.alloc(size*size*4);
  const repeat=meshProfile.repeatCount, center=meshProfile.centerlineU;
  for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
    const u=x/(size-1);
    const phase=(u-center)*repeat;
    const nearest=Math.round(phase-0.5)+0.5;
    const isStripe=Math.abs(phase-nearest)<=lineWidthRatio/2;
    const color=isStripe?stripe:background, off=(y*size+x)*4;
    raw[off]=color[0];raw[off+1]=color[1];raw[off+2]=color[2];raw[off+3]=255;
  }
  const png=await sharp(raw,{raw:{width:size,height:size,channels:4}}).png({compressionLevel:9}).toBuffer();
  textureBuffers.set(meshIndex,png);
  const offset=(doc.bin.length+3)&~3;
  doc.bin=Buffer.concat([doc.bin,Buffer.alloc(offset-doc.bin.length),png]);
  const bufferView=doc.g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:png.length})-1;
  const image=doc.g.images.push({name:`ATEL-53 blue white pinstripe mesh ${meshIndex}`,bufferView,mimeType:'image/png'})-1;
  const texture=doc.g.textures.push({name:`ATEL-53 pinstripe texture mesh ${meshIndex}`,source:image,sampler})-1;
  const material=doc.g.materials.push({name:`Sky blue cotton-poplin-like pinstripe mesh ${meshIndex}`,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],baseColorTexture:{index:texture,texCoord:0},metallicFactor:preset.appearance.metallicFactor,roughnessFactor:preset.appearance.roughnessFactor},alphaMode:'OPAQUE'})-1;
  for(const primitive of mesh.primitives) primitive.material=material;
  textureRecords.push({mesh:meshIndex,path:`${outputDirFor(job)}/basecolor-mesh${meshIndex}.png`,sha256:shaBuffer(png),bytes:png.length,size:`${size}x${size}`,repeatCount:repeat,centerlineU:center});
}
const button=doc.g.materials.push({name:'Soft white shirt-button display simulation',doubleSided:true,pbrMetallicRoughness:{baseColorFactor:preset.hardware.baseColorFactorLinear,metallicFactor:preset.hardware.metallicFactor,roughnessFactor:preset.hardware.roughnessFactor},alphaMode:'OPAQUE'})-1;
for(const meshIndex of buttonMeshes) for(const primitive of doc.g.meshes[meshIndex].primitives) primitive.material=button;
if(!sourceBin.equals(doc.bin.subarray(0,sourceBin.length))) throw new Error('Source geometry/UV buffer changed during surface creation');

const outputDir=outputDirFor(job); fs.mkdirSync(inside(outputDir),{recursive:true});
for(const rec of textureRecords) fs.writeFileSync(inside(rec.path),textureBuffers.get(rec.mesh));
const garmentPath=`${outputDir}/garment.glb`;
writeGlb(inside(garmentPath),doc);
const outputDoc=readGlb(inside(garmentPath));
if(!sourceBin.equals(outputDoc.bin.subarray(0,sourceBin.length))) throw new Error('Written GLB does not preserve source geometry/UV buffer prefix');

// Ensure sidecar texture bytes and their embedded GLB image bytes are identical.
for(const rec of textureRecords){
  const bytes=fs.readFileSync(inside(rec.path));
  if(shaBuffer(bytes)!==rec.sha256) throw new Error(`Texture sidecar mismatch for mesh ${rec.mesh}`);
}
const artifactPaths=[garmentPath,...textureRecords.map(x=>x.path),job.material,job.artwork,job.placementProfile,jobPath,'orders/ATEL-53/material/apply-shirt-surface.mjs'];
const artifacts=artifactPaths.map(p=>({path:p,sha256:sha(inside(p)),bytes:fs.statSync(inside(p)).size}));
const manifest={
  orderId:job.orderId,revision:job.revision,stage:'surface',geometryChanged:false,
  sourceGeometry:{path:job.garment,sha256:job.garmentSha256,bytes:fs.statSync(sourcePath).size,geometryBufferSha256:sourceBufferSha256},
  garment:{path:garmentPath,sha256:sha(inside(garmentPath)),bytes:fs.statSync(inside(garmentPath)).size},
  textures:textureRecords,
  material:{path:job.material,sha256:sha(inside(job.material)),shader:preset.shader,simulatedSource:preset.sourceNote,baseColorHexSRGB:preset.appearance.baseColorHexSRGB,roughnessFactor:preset.appearance.roughnessFactor,metallicFactor:preset.appearance.metallicFactor,hardware:preset.hardware},
  placement:{path:job.placementProfile,sha256:sha(inside(job.placementProfile)),profile:profile.profile,surfaceMapping:profile.surfaceMapping,coordinateSpace:profile.placement.coordinateSpace,stripeAxis:profile.placement.stripeAxis,surfaceExtent:profile.placement.surfaceExtent,uvPolicy:profile.placement.uvPolicy,textureRaster:profile.textureRaster,lineWidthRatio},
  integrity:{sourceBinaryPrefixPreserved:true,sourceGeometryBufferSha256:sourceBufferSha256,geometryAndUvBytesUnchanged:true,uvAccessorsChanged:false,transformsChanged:false,topologyChanged:false},
  artifacts
};
fs.writeFileSync(inside(`${outputDir}/surface.json`),JSON.stringify(manifest,null,2)+'\n');
const previewDir=`showcase/quality-preview/${job.orderId}/${job.revision}`;fs.mkdirSync(inside(previewDir),{recursive:true});
fs.copyFileSync(inside(garmentPath),inside(`${previewDir}/garment.glb`));
fs.writeFileSync(inside(`${previewDir}/index.html`),`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ATEL-53 · Surface preview</title><script type="module" src="/atelierx-products/assets/model-viewer.min.js"></script><style>body{margin:0;background:#d4dbe0;color:#18232c;font:16px system-ui}main{max-width:1100px;margin:auto;padding:20px}model-viewer{display:block;width:100%;height:84vh;min-height:500px;background:radial-gradient(#edf0f2,#aab5bd);border-radius:16px}</style></head><body><main><h1>ATEL-53 · Áo sơ mi xanh sọc trắng · surface preview</h1><p>Surface ${job.revision}; exact approved geometry SHA-256 ${job.garmentSha256}. Material preview, final viewer thuộc Visual.</p><model-viewer src="./garment.glb" camera-controls exposure="0.85" shadow-intensity="1" loading="eager" interaction-prompt="none" alt="Áo sơ mi xanh sọc trắng, surface review preview"></model-viewer></main></body></html>`);
console.log(JSON.stringify({surface:`${outputDir}/surface.json`,garment:manifest.garment,textures:textureRecords,previewUrl:`http://127.0.0.1:8787/atelierx-products/quality-preview/${job.orderId}/${job.revision}/index.html`,artifactCount:artifacts.length},null,2));

function outputDirFor(x){return `orders/${x.orderId}/${x.revision}/material`;}
function hexRgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function shaBuffer(b){return require('node:crypto').createHash('sha256').update(b).digest('hex');}
