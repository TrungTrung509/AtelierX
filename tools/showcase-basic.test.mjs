import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fixture} from './showcase-glb.test.mjs';
import {measureGarment,measureStandalone,projectFile,buildShowcase} from './showcase-basic.mjs';
import {writeGlb,readGlb} from './showcase-glb.mjs';
test('odd proportions warn instead of rejecting, while wrong world units fail',()=>{const ref=JSON.parse(fs.readFileSync(projectFile('quality/mannequin-fit.json'))),preset=JSON.parse(fs.readFileSync(projectFile('quality/showcase-presets.json'))).shirt;const doc=fixture();assert.equal(measureGarment(doc,ref,preset).status,'review');doc.g.nodes[0].scale=[100,100,100];assert.equal(measureGarment(doc,ref,preset).status,'fail')});
test('project paths reject escape',()=>assert.throws(()=>projectFile('../escape')));
test('standalone assembly contains garment only and never reads or merges mannequin',()=>{
 const dir=projectFile('orders/ATEL-9997'),out=projectFile('showcase/products/ATEL-9997');
 assert(!fs.existsSync(dir)&&!fs.existsSync(out),'reserved test paths must be absent');
 fs.mkdirSync(dir,{recursive:true});
 try{const doc=fixture();doc.bin.writeFloatLE(.1,8);writeGlb(dir+'/garment.glb',doc);fs.writeFileSync(dir+'/job.json',JSON.stringify({orderId:'ATEL-9997',revision:'v1',presentation:'standalone',garment:'orders/ATEL-9997/garment.glb',garmentType:'shirt',maskBody:true,material:{name:'test',source:'test'}}));const result=buildShowcase('orders/ATEL-9997/job.json','final');assert.equal(result.presentation,'standalone');assert.equal(result.mannequinSha256,null);assert.equal(result.mask.enabled,false);assert.equal(readGlb(out+'/v1/assets/display.glb').g.meshes.length,doc.g.meshes.length);assert.equal(measureStandalone(doc).status,'pass');}
 finally{fs.rmSync(dir,{recursive:true,force:true});fs.rmSync(out,{recursive:true,force:true});}
});
