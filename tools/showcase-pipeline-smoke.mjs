import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {buildShowcase,projectFile} from './showcase-basic.mjs';
import {assessProduct} from './quality-gate.mjs';
const id='ATEL-9998',rev='v1-smoke',order=projectFile(`orders/${id}`),product=projectFile(`showcase/products/${id}`);
if(fs.existsSync(order)||fs.existsSync(product))throw Error('Smoke directories already exist; refusing to overwrite');
const run=(tool,args)=>{const r=spawnSync(process.execPath,[projectFile(`tools/${tool}`),...args],{cwd:path.dirname(projectFile('tools')),encoding:'utf8'});if(r.status)throw Error(r.stderr+r.stdout);return r.stdout};
try{
  fs.mkdirSync(order,{recursive:true});run('create-product-viewer.mjs',[id,rev]);
  const job={orderId:id,revision:rev,garment:'orders/ATEL-23/v3-prototype/designer/garment-v3-prototype.glb',garmentType:'shirt',exposure:'opaque',maskBody:true,material:{name:'Poplin mô phỏng',source:'preset:poplin'}};
  const jf=`orders/${id}/job.json`;fs.writeFileSync(projectFile(jf),JSON.stringify(job));
  const assembly=buildShowcase(jf,'final');assert.notEqual(assembly.status,'fail');assert.throws(()=>buildShowcase(jf,'final'),/already built/);
  const contentFile=projectFile(`showcase/products/${id}/${rev}/content.json`),content=JSON.parse(fs.readFileSync(contentFile));
  Object.assign(content,{title:'Mẫu kiểm thử pipeline',summary:'Áo sơ mi mô phỏng trên mannequin để kiểm script ghép và hiển thị thông số.',material:job.material,style:'Sơ mi phom cơ bản',specifications:Object.entries(assembly.measurements).map(([label,value])=>({label,value,unit:'cm',source:'measurements.json'}))});
  fs.writeFileSync(contentFile,JSON.stringify(content));
  const out='quality/evidence/showcase-pipeline-smoke';
  run('browser-qa.mjs',['--basic','--url',`http://127.0.0.1:8787/atelierx-products/products/${id}/${rev}/index.html`,'--out',out]);
  const browser=JSON.parse(fs.readFileSync(projectFile(`${out}/browser-result.json`)));
  const p={id,revision:rev,deliveryProfile:'showcase-basic-v1',model:`products/${id}/${rev}/assets/display.glb`,viewer:`products/${id}/${rev}/index.html`,content:`products/${id}/${rev}/content.json`};
  const report={orderId:id,revision:rev,deliveryProfile:p.deliveryProfile,assembly:`showcase/products/${id}/${rev}/assembly.json`,assets:p,brief:{requiredFeatures:['script smoke']},featureChecks:[{feature:'script smoke',passed:true}],evidence:Object.fromEntries(['front','back','side','oblique'].map(v=>[v,`${out}/${v}.png`])),visual:{coverage:true,silhouette:true,folds:true,closures:true,contentMatches:true},browser,qaReviewer:'TEST ONLY - not a real product approval',leadApproved:true,blockers:[]};
  assert.deepEqual(assessProduct(p,report,{}),[]);
  content.specifications=[];fs.writeFileSync(contentFile,JSON.stringify(content));assert(assessProduct(p,report,{}).some(e=>e.includes('specifications')));
  fs.writeFileSync(projectFile(`${out}/pipeline-result.json`),JSON.stringify({testOnly:true,passed:true,maskedTriangles:assembly.mask.removedTriangles,views:Object.keys(browser.screenshots),warnings:assembly.warnings},null,2));
  console.log('Smoke passed: real GLB merge/mask, duplicate build guard, 4 views/mobile, content, gate and missing-spec rejection');
}finally{
  for(const dir of [order,product]){if(!dir.startsWith(path.dirname(projectFile('tools'))+path.sep)||path.basename(dir)!==id)throw Error('Unsafe test cleanup');fs.rmSync(dir,{recursive:true,force:true})}
}
