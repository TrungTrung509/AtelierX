import {primitives,readGlb} from './showcase-glb.mjs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export function checkButtons(doc){
  const names=doc.g.materials||[],parts=primitives(doc).filter(p=>/button/i.test(names[p.p.material]?.name||''));
  const rows=[];
  for(const part of parts){const sorted=[...part.points].sort((a,b)=>a[1]-b[1]);let group=[];
    const flush=()=>{if(!group.length)return;const span=k=>Math.max(...group.map(p=>p[k]))-Math.min(...group.map(p=>p[k]));rows.push({width:span(0),height:span(1),depth:span(2)});group=[]};
    for(const p of sorted){if(group.length&&p[1]-group.at(-1)[1]>.035)flush();group.push(p)}flush();
  }
  return {passed:rows.length>=3&&rows.every(r=>r.width>=.008&&r.height>=.008&&r.height/r.width>.4),rows,method:'Projected XY button geometry; QA still checks visibility/contrast in images'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const r=checkButtons(readGlb(process.argv[2]));console.log(JSON.stringify(r));if(!r.passed)process.exitCode=1}
