import test from 'node:test';
import assert from 'node:assert/strict';
import {assessBasic} from './showcase-basic-gate.mjs';
import fs from 'node:fs';
import {projectFile} from './showcase-basic.mjs';
const product={id:'ATEL-998',revision:'v1',model:'products/ATEL-998/v1/assets/display.glb',viewer:'products/ATEL-998/v1/index.html',content:'products/ATEL-998/v1/content.json'};
const report={orderId:product.id,revision:'v1',deliveryProfile:'showcase-basic-v1',assembly:'not-present.json',assets:product,brief:{requiredFeatures:['black']},featureChecks:[{feature:'black',passed:true}],evidence:{front:'front.png',back:'back.png',side:'side.png',oblique:'oblique.png'},visual:{coverage:true,silhouette:true,folds:true,closures:true,contentMatches:true},browser:{loaded:true,rotated:true,zoomed:true,desktop:true,mobile:true},qaReviewer:'independent-qa',leadApproved:true,blockers:[]};
report.browser.url=`http://127.0.0.1:8787/atelierx-products/products/${product.id}/${product.revision}/index.html`;
test('basic contract does not demand approved base, zero collision or long paragraphs',()=>assert.deepEqual(assessBasic(product,report,()=>true),[]));
test('fails missing folds, wrong brief, missing image or mismatched revision',()=>{for(const change of [r=>r.visual.folds=false,r=>r.featureChecks=[],r=>r.evidence.side=null,r=>r.revision='v2']){const r=structuredClone(report);change(r);assert(assessBasic(product,r,()=>true).length>0)}});
test('standalone final requires early shape evidence even if final booleans pass',()=>{
 const relative='quality/standalone-gate-test',dir=projectFile(relative);assert(!fs.existsSync(dir));fs.mkdirSync(dir);
 try{fs.writeFileSync(dir+'/assembly.json',JSON.stringify({orderId:product.id,revision:'v1',stage:'final',status:'pass',presentation:'standalone'}));const r=structuredClone(report);r.assembly=relative+'/assembly.json';assert(assessBasic(product,r,()=>true).includes('Missing early shape review'));r.shapeReview=relative+'/shape.json';fs.writeFileSync(dir+'/shape.json',JSON.stringify({orderId:product.id,decision:'pass',reviewer:'qa',checks:{garmentType:true,connectedParts:true,structure:true},evidence:{front:'front.png',back:'back.png',oblique:'oblique.png'}}));assert(assessBasic(product,r,()=>true).some(e=>e.includes('invisible-body'))); /* Shape booleans cannot replace cloth appearance evidence. */}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
});
