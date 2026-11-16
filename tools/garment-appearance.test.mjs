import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projectFile} from './showcase-basic.mjs';
import {assessGarmentAppearance} from './garment-appearance.mjs';
test('booleans alone cannot qualify cloth; six current images and independent observations required',()=>{
  assert(assessGarmentAppearance({}, {visual:{folds:true,silhouette:true}}).length);
  const dir=fs.mkdtempSync(projectFile('quality/appearance-test-'));
  try{
    const relative='quality/'+path.basename(dir),evidence={},evidenceSha256={};
    for(const view of ['front','back','side','oblique','top','bottom']){
      const bytes=Buffer.from('unique evidence '+view);fs.writeFileSync(path.join(dir,view+'.png'),bytes);
      evidence[view]=relative+'/'+view+'.png';evidenceSha256[view]=createHash('sha256').update(bytes).digest('hex');
    }
    const report={qaReviewer:'qa',evidence,evidenceSha256,garmentAppearance:{profile:'invisible-body-v1',reviewer:'qa',benchmark:'ATEL-35/v1',checks:{}}};
    for(const key of ['hollowOpenings','naturalDrape','fabricEdges','garmentConstruction','benchmarkComparison'])report.garmentAppearance.checks[key]={passed:true,observation:'Specific visual inspection recorded by independent reviewer',evidence:[evidence.top,evidence.bottom]};
    assert.deepEqual(assessGarmentAppearance({},report),[]);
    const shirt={category:'Sơ mi'};
    assert(assessGarmentAppearance(shirt,report).some(e=>e.includes('placketSideCloseup')));
    for(const view of ['collarCloseup','placketSideCloseup','cuffCloseup']){
      const bytes=Buffer.from('detail '+view);fs.writeFileSync(path.join(dir,view+'.png'),bytes);
      report.evidence[view]=relative+'/'+view+'.png';report.evidenceSha256[view]=createHash('sha256').update(bytes).digest('hex');
    }
    for(const key of ['collarConstruction','buttonAttachment','trimFollowsGeometry'])report.garmentAppearance.checks[key]={passed:true,observation:'Independent detail inspection with attachment and collar construction observations',evidence:[report.evidence.placketSideCloseup]};
    assert.deepEqual(assessGarmentAppearance(shirt,report),[]);
    report.garmentAppearance.checks.buttonAttachment.passed=false;
    assert(assessGarmentAppearance(shirt,report).some(e=>e.includes('buttonAttachment')));
    fs.writeFileSync(path.join(dir,'bottom.png'),'changed');assert(assessGarmentAppearance({},report).some(e=>e.includes('bottom')));
    report.garmentAppearance.checks.hollowOpenings.passed=false;assert(assessGarmentAppearance({},report).some(e=>e.includes('hollowOpenings')));
  }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
