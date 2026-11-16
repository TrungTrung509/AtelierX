import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readGlb,writeGlb,primitives,mergeGlb,maskCoveredBody} from './showcase-glb.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const projectFile=p=>{const f=path.resolve(root,p);if(!f.startsWith(root+path.sep))throw Error('Path must be inside project');return f};
const json=p=>JSON.parse(fs.readFileSync(projectFile(p),'utf8'));
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
export function measureStandalone(doc,displayScale=1){
  if(!Number.isFinite(displayScale)||displayScale<=0||displayScale>1)throw Error('Invalid standalone displayScale (expected > 0 and <= 1)');
  const points=primitives(doc).flatMap(p=>p.points);
  if(!points.length||points.some(p=>p.some(v=>!Number.isFinite(v))))throw Error('Invalid garment geometry');
  const min=points.reduce((a,p)=>a.map((v,k)=>Math.min(v,p[k])),[Infinity,Infinity,Infinity]),max=points.reduce((a,p)=>a.map((v,k)=>Math.max(v,p[k])),[-Infinity,-Infinity,-Infinity]);
  const rawSpans=max.map((v,k)=>v-min[k]),spans=rawSpans.map(v=>v*displayScale);
  const errors=spans.some(v=>v<=0||v>3)||Math.max(...spans)<.1?['Invalid garment envelope or units']:[];
  const sectionY=min[1]+rawSpans[1]*.75,section=[];
  for(const {points,indices} of primitives(doc))for(let i=0;i<indices.length;i+=3){const tri=indices.slice(i,i+3).map(j=>points[j]);for(let k=0;k<3;k++){const u=tri[k],v=tri[(k+1)%3];if((u[1]<=sectionY&&v[1]>sectionY)||(v[1]<=sectionY&&u[1]>sectionY)){const t=(sectionY-u[1])/(v[1]-u[1]);section.push(u[0]+t*(v[0]-u[0]))}}}
  const measurements={envelopeWidthCm:spans[0]*100,garmentLengthCm:spans[1]*100,envelopeDepthCm:spans[2]*100};
  if(section.length)measurements.upperBodySpanCm=(Math.max(...section)-Math.min(...section))*displayScale*100;
  return {status:errors.length?'fail':'pass',errors,warnings:[],measurements,boundsMeters:{min:min.map(v=>v*displayScale),max:max.map(v=>v*displayScale)},displayScale,method:`World-space mesh envelope and horizontal silhouette section at 75% of garment height, scaled for display by ${displayScale}. Display references only, not sewing or body measurements.`};
}
export function measureGarment(doc,reference,preset){
  const parts=primitives(doc),points=parts.flatMap(p=>p.points);
  if(!points.length||points.some(p=>p.some(v=>!Number.isFinite(v))))throw Error('Invalid garment geometry');
  const min=points.reduce((a,p)=>a.map((v,k)=>Math.min(v,p[k])),[Infinity,Infinity,Infinity]),max=points.reduce((a,p)=>a.map((v,k)=>Math.max(v,p[k])),[-Infinity,-Infinity,-Infinity]);
  const warnings=[],errors=[],a=reference.anchors,chestY=reference.measurements.chest.y,sections=[];
  for(const {points,indices} of parts)for(let i=0;i<indices.length;i+=3){const tri=indices.slice(i,i+3).map(j=>points[j]);for(let k=0;k<3;k++){const u=tri[k],v=tri[(k+1)%3];if((u[1]<=chestY&&v[1]>chestY)||(v[1]<=chestY&&u[1]>chestY)){const t=(chestY-u[1])/(v[1]-u[1]),x=u[0]+t*(v[0]-u[0]);if(Math.abs(x)<.34)sections.push(x)}}}
  const chest=sections.length?100*(Math.max(...sections)-Math.min(...sections)):null;
  const shoulderSpan=100*Math.abs(a.positiveX_shoulder[0]-a.negativeX_shoulder[0]);
  const measurements={chestWidthCm:chest,garmentLengthCm:100*(max[1]-min[1]),sleeveExtentCm:100*(Math.max(Math.abs(min[0]),Math.abs(max[0]))-shoulderSpan/200),shoulderReferenceCm:shoulderSpan};
  if(max.some((v,k)=>v-min[k]>3)||max[1]<.5||min[1]>1.9||min[0]>.4||max[0]<-.4)errors.push('Wrong units, location or extreme size');
  const check=(label,value,range)=>{if(value===null||value<range[0]||value>range[1])warnings.push(`${label}: ${value===null?'missing':value.toFixed(1)}; reference ${range.join('–')}`)};
  check('chest width (cm)',chest,preset.chestWidthRatio.map(v=>v*reference.measurements.chest.width*100));
  check('garment envelope length (cm)',measurements.garmentLengthCm,preset.lengthCm);
  check('sleeve horizontal extent (cm)',measurements.sleeveExtentCm,preset.sleeveCm);
  return {status:errors.length?'fail':warnings.length?'review':'pass',errors,warnings,measurements,boundsMeters:{min,max},method:'World-space mesh envelope and chest section. Sleeve extent and mannequin shoulder span are display references, not sewing measurements.'};
}
export function buildShowcase(jobFile,stage){
  if(!['draft','final','correction','repair','verified-fix'].includes(stage))throw Error('Invalid showcase stage');
  const job=json(jobFile),standalone=job.presentation==='standalone',preset=json('quality/showcase-presets.json')[job.garmentType];
  if(!preset&&!standalone)throw Error('Unknown garment preset');
  if(!/^ATEL-\d+$/.test(job.orderId)||!/^v[\w.-]+$/.test(job.revision))throw Error('Invalid order/revision');
  if(!job.material?.name||!job.material?.source)throw Error('Material name and brief/preset source required');
  const dir=projectFile(`showcase/products/${job.orderId}/${job.revision}`),dest=path.join(dir,'assets/display.glb');
  const ledgerFile=projectFile(`orders/${job.orderId}/showcase-builds.json`);
  const ledger=fs.existsSync(ledgerFile)?JSON.parse(fs.readFileSync(ledgerFile)):{};
  const garment=readGlb(projectFile(job.garment)),reference=standalone?null:json('quality/mannequin-fit.json');
  const displayScale=standalone?(job.displayScale??1):1;
  const measured=standalone?measureStandalone(garment,displayScale):measureGarment(garment,reference,preset);
  if(measured.errors.length)throw Error(measured.errors.join('; '));
  const inputHash=hash(projectFile(job.garment)),slot=`${job.orderId}:${stage}`;
  if(ledger[slot])throw Error('Stage already built; use its existing output or one explicit correction stage');
  if(stage==='correction'&&!ledger[`${job.orderId}:final`])throw Error('Correction requires a final build');
  if(stage==='repair'&&!ledger[`${job.orderId}:correction`])throw Error('Repair requires a correction build');
  if(stage==='verified-fix'&&(!ledger[`${job.orderId}:repair`]||!job.diagnosticReport))throw Error('Verified fix requires previous repair and a diagnostic report');
  if(stage==='verified-fix'&&!fs.existsSync(projectFile(job.diagnosticReport)))throw Error('Diagnostic report file missing');
  const body=standalone?null:readGlb(projectFile(reference.file));
  const exception=job.exposure==='open'||job.exposure==='sheer'||job.exposure==='sleeveless';
  let removed=0;
  if(!standalone&&job.maskBody===true&&!exception){const cfg={...preset.mask,minY:Math.max(preset.mask.minY,measured.boundsMeters.min[1]+.08)};removed=maskCoveredBody(body,garment,cfg)}
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  writeGlb(dest,standalone?garment:mergeGlb(body,garment));
  const record={orderId:job.orderId,revision:job.revision,deliveryProfile:'showcase-basic-v1',presentation:standalone?'standalone':'mannequin',stage,garmentSha256:inputHash,displaySha256:hash(dest),mannequinSha256:standalone?null:hash(projectFile(reference.file)),mask:{enabled:!standalone&&job.maskBody===true&&!exception,removedTriangles:removed,exception},...measured};
  fs.writeFileSync(path.join(dir,'assembly.json'),JSON.stringify(record,null,2));
  fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify({...measured.measurements,units:'cm',kind:'3D display references, not manufactured garment sizing',displayScale:measured.displayScale??1,method:measured.method,garmentSha256:inputHash},null,2));
  fs.mkdirSync(path.dirname(ledgerFile),{recursive:true});ledger[slot]={revision:job.revision,model:path.relative(root,dest),sha256:record.displaySha256};fs.writeFileSync(ledgerFile,JSON.stringify(ledger,null,2));
  console.log(JSON.stringify({stage,status:record.status,warnings:record.warnings,model:path.relative(root,dest),measurements:path.relative(root,path.join(dir,'measurements.json'))}));
  return record;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildShowcase(process.argv[2],process.argv[3]);
