import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {projectFile} from './showcase-basic.mjs';
/** Verify evidence, not aesthetics: a human/agent must inspect actual images. */
export function assessGarmentAppearance(product,report){
  const a=report?.garmentAppearance,errors=[];
  if(a?.profile!=='invisible-body-v1'||a.reviewer!==report.qaReviewer||a.benchmark!=='ATEL-35/v1')return ['Missing independent invisible-body garment appearance review against ATEL-35/v1'];
  const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  const briefText=[product.category,product.name,report.brief?.garmentType,...(report.brief?.requiredFeatures||[])].join(' ');
  const shirt=a.garmentType==='shirt'||a.garmentType==='dress-shirt'||/sơ\s*mi|button[ -]?(up|down)|dress[ -]?shirt/i.test(briefText)||report.brief?.garmentType==='shirt';
  const views=['front','back','side','oblique','top','bottom'];
  if(shirt)views.push('collarCloseup','placketSideCloseup','cuffCloseup');
  for(const view of views){
    const relative=report.evidence?.[view];let file;
    try{file=projectFile(relative)}catch{}
    if(!file||!fs.existsSync(file)||report.evidenceSha256?.[view]!==hash(file))errors.push(`Missing/current-hash garment appearance ${view} image`);
  }
  const checks=['hollowOpenings','naturalDrape','fabricEdges','garmentConstruction','benchmarkComparison'];
  if(shirt)checks.push('collarConstruction','buttonAttachment','trimFollowsGeometry');
  for(const key of checks){
    const c=a.checks?.[key];
    if(c?.passed!==true||typeof c.observation!=='string'||c.observation.trim().length<20||!Array.isArray(c.evidence)||!c.evidence.length){errors.push('Garment appearance not demonstrated: '+key);continue}
    for(const p of c.evidence){try{if(!fs.existsSync(projectFile(p)))errors.push('Missing garment visual evidence: '+p)}catch{errors.push('Invalid garment visual evidence: '+p)}}
  }
  return errors;
}
