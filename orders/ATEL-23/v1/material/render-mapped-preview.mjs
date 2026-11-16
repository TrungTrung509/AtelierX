import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../../..');
const fitPath=path.join(root,'orders/ATEL-23/v1/designer/fit.json');
const fit=JSON.parse(fs.readFileSync(fitPath,'utf8'));
const sourcePath=path.resolve(root,fit.fitPreview.path);
const expected=fit.fitPreview.sha256;
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if(hash(sourcePath)!==expected)throw new Error('Fit preview SHA mismatch; refusing to render stale geometry.');
if(!fit.garment.topology.hasTEXCOORD_0)throw new Error('TEXCOORD_0 is absent from Designer fit manifest.');

const evidenceDir=path.join(dir,'evidence');
fs.mkdirSync(evidenceDir,{recursive:true});
const src=fs.readFileSync(sourcePath);
if(src.toString('ascii',0,4)!=='glTF'||src.readUInt32LE(4)!==2)throw new Error('Expected a glTF 2.0 binary fit preview.');
const jsonLength=src.readUInt32LE(12),jsonStart=20;
const gltf=JSON.parse(src.subarray(jsonStart,jsonStart+jsonLength).toString('utf8').replace(/\0+$/,'').trimEnd());
const binHeader=jsonStart+jsonLength;
const binLength=src.readUInt32LE(binHeader),binType=src.toString('ascii',binHeader+4,binHeader+8);
if(binType!=='BIN\0')throw new Error(`Unexpected GLB binary chunk ${JSON.stringify(binType)}.`);
const binHeaderBytes=src.subarray(binHeader,binHeader+8);
const bin=src.subarray(binHeader+8,binHeader+8+binLength);
const shirtMesh=gltf.meshes.findIndex(m=>m.name==='ATEL-23 Shirt v1 geometry');
if(shirtMesh<0)throw new Error('Shirt mesh not found in fit preview.');
const shirtPrimitive=gltf.meshes[shirtMesh].primitives[0];
const garmentMaterial=shirtPrimitive.material;
if(garmentMaterial===undefined)throw new Error('Shirt primitive has no material slot.');
if(!('TEXCOORD_0' in shirtPrimitive.attributes))throw new Error('Shirt primitive does not contain TEXCOORD_0.');

const textureBase=gltf.textures?.length||0, imageBase=gltf.images?.length||0, samplerIndex=gltf.samplers?.length||0;
gltf.images??=[]; gltf.textures??=[]; gltf.samplers??=[];
const names=['base-color.png','roughness.png','normal.png'];
for(let i=0;i<names.length;i++)gltf.images.push({name:`ATEL-23/v1 ${names[i]}`,uri:`../${names[i]}`});
gltf.samplers.push({magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497});
for(let i=0;i<names.length;i++)gltf.textures.push({sampler:samplerIndex,source:imageBase+i});
const material=gltf.materials[garmentMaterial];
material.name='ATEL-23/v1 diagnostic textile-map preview — QA pending';
material.pbrMetallicRoughness={
  ...(material.pbrMetallicRoughness||{}),baseColorFactor:[1,1,1,1],
  baseColorTexture:{index:textureBase,texCoord:0},metallicFactor:0,roughnessFactor:.96,
  metallicRoughnessTexture:{index:textureBase+1,texCoord:0}
};
material.normalTexture={index:textureBase+2,texCoord:0,scale:.12};
material.doubleSided=true;
const json=Buffer.from(JSON.stringify(gltf));
const paddedJson=Buffer.alloc((json.length+3)&~3,0x20);json.copy(paddedJson);
const header=Buffer.alloc(12);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+paddedJson.length+8+bin.length,8);
const jsonHeader=Buffer.alloc(8);jsonHeader.writeUInt32LE(paddedJson.length);jsonHeader.write('JSON',4);
const outPath=path.join(evidenceDir,'texture-mapped-fit-preview.glb');
fs.writeFileSync(outPath,Buffer.concat([header,jsonHeader,paddedJson,binHeaderBytes,bin]));

const pagePath=path.join(evidenceDir,'index.html');
fs.writeFileSync(pagePath,`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ATEL-23 material map diagnostic</title><style>body{margin:0;background:#cbd2d8;color:#18212b;font:16px/1.5 system-ui,sans-serif}main{max-width:1280px;margin:auto;padding:24px}model-viewer{width:100%;height:78vh;min-height:600px;background:radial-gradient(#e4e8eb,#aab4be);border-radius:14px}.note{background:#f7f8f9;padding:12px 16px;border-radius:8px}</style><script type="module" src="http://127.0.0.1:8787/atelierx-products/assets/model-viewer.min.js"></script><main><h1>ATEL-23/v1 · Kiểm tra map vật liệu</h1><p class="note">Bản chẩn đoán dùng fit preview + PBR texture trên UV0. Không phải viewer sản phẩm cuối, verdict QA hay duyệt G1.</p><model-viewer id="preview" src="/evidence/texture-mapped-fit-preview.glb" camera-orbit="0deg 78deg 3.1m" field-of-view="30deg" camera-controls interaction-prompt="none" shadow-intensity="1.1" exposure="1.1" alt="Bản chẩn đoán map vật liệu trên mannequin-v1 và sơ mi"></model-viewer></main></html>`);

const types={'.html':'text/html; charset=utf-8','.glb':'model/gltf-binary','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if(pathname==='/favicon.ico'){res.writeHead(204).end();return;}
  const target=path.resolve(dir,`.${pathname}`);
  if(!target.startsWith(dir+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':types[path.extname(target)]||'application/octet-stream','access-control-allow-origin':'*'});res.end(data);});
});
await new Promise(resolve=>server.listen(8788,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const result={sourceFitPreviewSha256:expected,diagnosticGlbSha256:hash(outPath),loaded:false,errors:[],failedResources:[],capture:null,warning:'Texture mapping preview only; independent QA and G1 remain pending.'};
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>result.errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')result.errors.push(msg.text());});
  page.on('response',response=>{if(response.status()>=400)result.failedResources.push({status:response.status(),url:response.url()});});
  const response=await page.goto('http://127.0.0.1:8788/evidence/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  if(!response?.ok())throw new Error(`Preview HTTP ${response?.status()}`);
  await page.waitForFunction(()=>document.querySelector('model-viewer')?.loaded===true,{timeout:30000});
  result.loaded=true;
  await page.waitForTimeout(600);
  result.capture=path.join(evidenceDir,'texture-mapped-fit-preview.png');
  await page.screenshot({path:result.capture,fullPage:true});
}catch(e){result.errors.push(e.message);}finally{
  await browser.close();server.close();
  fs.writeFileSync(path.join(evidenceDir,'capture-report.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  if(!result.loaded||result.errors.length||result.failedResources.length)process.exitCode=1;
}
