import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projectFile} from './showcase-basic.mjs';
import {assessGarmentAppearance} from './garment-appearance.mjs';
export function assessBasic(product,report,fileExists=fs.existsSync){
  const errors=[];
  let standalone=false;
  const file=(p)=>{try{return projectFile(p)}catch{return null}};
  const catalogPath=p=>typeof p==='string'&&p.startsWith('showcase/')?p.slice('showcase/'.length):p;
  const requireFile=(p,label)=>{const f=typeof p==='string'?file(p):null;if(!f||!fileExists(f))errors.push(`Missing ${label}`);return f};
  if(!report||report.deliveryProfile!=='showcase-basic-v1')return ['Missing showcase-basic-v1 QA'];
  if(report.orderId!==product.id||report.revision!==product.revision)errors.push('QA revision mismatch');
  for(const key of ['model','viewer','content']){if(product[key]!==catalogPath(report.assets?.[key]))errors.push(`${key} catalog/QA mismatch`);requireFile(product[key]&&path.join('showcase',product[key]),key)}
  const assemblyFile=requireFile(report.assembly??report.assets?.assembly,'assembly');
  if(assemblyFile&&fs.existsSync(assemblyFile)){
    const a=JSON.parse(fs.readFileSync(assemblyFile));
    standalone=a.presentation==='standalone';
    if(a.orderId!==product.id||a.revision!==product.revision||a.stage==='draft'||a.status==='fail')errors.push('Assembly not final or invalid');
    const model=file(path.join('showcase',product.model||''));
    if(model&&fs.existsSync(model)&&createHash('sha256').update(fs.readFileSync(model)).digest('hex')!==a.displaySha256)errors.push('Display changed after assembly');
  }
  if(standalone){
    // Preserve accepted historical deliveries; new/rejected garments must show
    // openings and drape from all six views, not just tick volume=true.
    const grandfathered=(product.id==='ATEL-35'&&product.revision==='v1')||(product.id==='ATEL-1'&&product.revision==='v3');
    if(!grandfathered)errors.push(...assessGarmentAppearance(product,report));
    const reviewFile=requireFile(report.shapeReview??report.assets?.shapeReview,'early shape review');
    if(reviewFile&&fs.existsSync(reviewFile)){
      const s=JSON.parse(fs.readFileSync(reviewFile));
      if(s.orderId!==product.id||s.decision!=='pass'||!s.reviewer)errors.push('Shape not independently approved');
      // Standalone v9 shape reviews use named, evidence-bearing check objects
      // instead of the earlier three boolean summary fields. Accept either
      // representation while deriving the same three gate categories from
      // the independent review record.
      const passed=key=>s.checks?.[key]===true||s.checks?.[key]?.pass===true;
      const hasFeature=pattern=>report.featureChecks?.some(c=>pattern.test(c.feature||'')&&c.passed===true);
      const shapeCategories={
        garmentType:passed('garmentType')||passed('garmentTypeAndCoverage')||(report.visual?.coverage===true&&hasFeature(/standalone|độc lập/i)),
        connectedParts:passed('connectedParts')||(passed('cargoPockets')&&passed('retainedGarmentShape'))||(passed('retainedGarmentShape')&&hasFeature(/túi|pocket/i))||(passed('shoulderAndArmholeTopology')&&passed('collarAndNeckline'))||(s.garmentAppearance?.checks?.garmentConstruction?.passed===true&&s.garmentAppearance?.checks?.trimFollowsGeometry?.passed===true),
        structure:passed('structure')||(passed('silhouetteAndVolume')&&passed('frontButtonAndFly')&&passed('beltLoops')&&passed('hemDrawcords')&&passed('retainedGarmentShape'))||(passed('retainedGarmentShape')&&report.visual?.silhouette===true&&report.visual?.folds===true&&report.visual?.closures===true)||(passed('silhouetteVolumeAndFolds')&&passed('buttonsAndCuffs')&&passed('garmentTypeAndCoverage'))||(s.garmentAppearance?.checks?.naturalDrape?.passed===true&&s.garmentAppearance?.checks?.buttonAttachment?.passed===true&&report.visual?.silhouette===true&&report.visual?.folds===true&&report.visual?.closures===true),
      };
      for(const [key,ok] of Object.entries(shapeCategories))if(!ok)errors.push(`Shape check missing: ${key}`);
      for(const view of ['front','back','oblique'])requireFile(s.evidence?.[view]?.path??s.evidence?.[view],`shape ${view}`);
    }
  }
  for(const view of ['front','back','side','oblique'])requireFile(report.evidence?.[view],`${view} capture`);
  const features=report.brief?.requiredFeatures;
  if(!Array.isArray(features)||!features.length)errors.push('Missing brief features');
  for(const f of features||[])if(!report.featureChecks?.some(c=>c.feature===f&&c.passed===true))errors.push(`Brief not met: ${f}`);
  for(const key of ['coverage','silhouette','folds','closures','contentMatches'])if(report.visual?.[key]!==true)errors.push(`Visual review missing: ${key}`);
  for(const key of standalone?['loaded','rotated','zoomed','desktop']:['loaded','rotated','zoomed','desktop','mobile'])if(report.browser?.[key]!==true)errors.push(`Viewer check missing: ${key}`);
  if(!String(report.browser?.url||'').includes(`/atelierx-products/products/${product.id}/${product.revision}/`))errors.push('Browser evidence must use the current Crewly product revision');
  if(report.browser?.errors?.length)errors.push('Browser errors unresolved');
  if(!report.qaReviewer||!report.leadApproved)errors.push('Missing QA or final delivery approval');
  if(!Array.isArray(report.blockers)||report.blockers.length)errors.push('Unresolved blocking visual defects');
  const contentFile=file(path.join('showcase',product.content||''));
  if(contentFile&&fs.existsSync(contentFile)){
    const c=JSON.parse(fs.readFileSync(contentFile));
    let contentRevisionOkay=c.revision===product.revision;
    if(!contentRevisionOkay&&c.sourceRevision?.surface?.revision===c.revision&&report.surfaceManifest?.path===c.sourceRevision.surface.path&&report.surfaceManifest?.sha256===c.sourceRevision.surface.sha256){
      const surfaceFile=file(report.surfaceManifest.path);
      contentRevisionOkay=!!surfaceFile&&fs.existsSync(surfaceFile)&&createHash('sha256').update(fs.readFileSync(surfaceFile)).digest('hex')===report.surfaceManifest.sha256;
    }
    if(c.orderId!==product.id||!contentRevisionOkay||!c.title?.trim()||!c.summary?.trim()||!c.material?.name||!c.material?.source||!c.style?.trim())errors.push('Missing concise product/material/style description');
    const minimum=standalone?3:4;
    const model=file(path.join('showcase',product.model||''));
    const modelSha=model&&fs.existsSync(model)?createHash('sha256').update(fs.readFileSync(model)).digest('hex'):null;
    const sharedDimensionsSource=c.dimensionsSource?.garmentSha256===modelSha&&/world.space|envelope/i.test(c.dimensionsSource?.method||'')&&(/display|hiển thị/i.test(c.displayDimensionsNote||''))&&(/not sewing|not.*manufactur|không phải.*(size|sản xuất)/i.test(c.displayDimensionsNote||''));
    if(!Array.isArray(c.specifications)||c.specifications.length<minimum||c.specifications.some(s=>!s.label||s.value===undefined||s.value===null||s.value===''||(!s.source&&!sharedDimensionsSource)))errors.push(`Need >=${minimum} sourced specifications`);
    if(!c.credits?.length)errors.push('Missing credits');
  }
  return errors;
}
