import fs from 'node:fs';
import {readGlb,accessor,primitives} from '../../../tools/showcase-glb.mjs';
import {sha} from '../../../tools/studio-base.mjs';

const source='orders/ATEL-63/v1/designer/sweater-gray-v1.glb';
const shapeReport='quality/reports/ATEL-63/sweater-v1-gray.json';
const flow=JSON.parse(fs.readFileSync('orders/ATEL-63/studio-flow.json','utf8'));
const qa=JSON.parse(fs.readFileSync(shapeReport,'utf8'));
if(!flow.shapeApproved||qa.decision!=='pass'||qa.garment.sha256!==sha(source))throw Error('Surface bị chặn: cần shape QA pass đúng hash nguồn');
const placement=JSON.parse(fs.readFileSync('orders/ATEL-63/material/placement-v1.json','utf8'));
const sourceUv=JSON.parse(fs.readFileSync('orders/ATEL-63/v1/designer/uv-placement.json','utf8'));
if(sourceUv.geometryUnchanged!==true||sourceUv.sourceGlbSha256!==sha('quality/candidates/user-supplied/sweater.glb'))throw Error('UV placement không khớp nguồn Designer');
const doc=readGlb(source), parts=primitives(doc);
if(doc.g.meshes.length!==1||doc.g.meshes[0].name!=='defaultMaterial'||parts.length!==1)throw Error('Mapping v1 yêu cầu mesh vải duy nhất đã kiểm');
const part=parts[0], uv=accessor(doc,part.p.attributes.TEXCOORD_0);
if(!Number.isInteger(part.p.attributes.TEXCOORD_0)||!uv.length)throw Error('Thiếu TEXCOORD_0');
const points=part.points,indices=part.indices,size=2048;
const masks={neck:[],leftCuff:[],rightCuff:[],hem:[]};
const counts={neck:0,leftCuff:0,rightCuff:0,hem:0};
// Clip each source face against linear world-space boundaries, then project its
// resulting polygon through the same face's existing UVs. This yields smooth
// bands without changing topology, vertex attributes or UV coordinates.
function clip(poly,fn){
  const out=[];if(!poly.length)return out;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length],fa=fn(a),fb=fn(b),ain=fa>=0,bin=fb>=0;
    if(ain&&bin)out.push(b);
    else if(ain&&!bin){const t=fa/(fa-fb);out.push(a.map((v,k)=>v+(b[k]-v)*t));}
    else if(!ain&&bin){const t=fa/(fa-fb);out.push(a.map((v,k)=>v+(b[k]-v)*t),b);}
  }
  return out;
}
const masksSpec={
  neck:[v=>v[1]-6.84,v=>.52-v[0],v=>.52+v[0]],
  leftCuff:[v=>v[0]-2.52],
  rightCuff:[v=>-2.52-v[0]],
  hem:[v=>4.72-v[1],v=>1.2-v[0],v=>1.2+v[0]],
};
const fmt=n=>Number(n.toFixed(2));
for(let i=0;i<indices.length;i+=3){
  const ids=indices.slice(i,i+3);
  if(ids.length!==3)throw Error('Index list is not triangular');
  const poly=ids.map(id=>[...points[id],...uv[id]]);
  for(const [name,planes] of Object.entries(masksSpec)){
    let region=poly;for(const plane of planes)region=clip(region,plane);
    if(region.length<3)continue;
    const coords=region.map(v=>[v[3]*size,v[4]*size]);
    const path='M'+coords.map(v=>`${fmt(v[0])} ${fmt(v[1])}`).join('L')+'Z';
    masks[name].push(path);counts[name]++;
  }
}
if(Object.values(counts).some(v=>!v))throw Error('Trim mask empty: '+JSON.stringify(counts));
const svg=fs.readFileSync('orders/ATEL-63/research/christmas-tree-snowflakes.svg','utf8');
const embedded=svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
if(!embedded)throw Error('Research artwork SVG parse failed');
const p=placement.artworkPlacement, x=(p.center.u-p.size.width/2)*size,y=(p.center.v-p.size.height/2)*size,w=p.size.width*size,h=p.size.height*size;
const d=`orders/ATEL-63/v1/material/sweater-uv-atlas-v1.svg`;
const out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><defs><pattern id="knit" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M-3 3L3-3M0 12L12 0M9 15L15 9" fill="none" stroke="#B8757D" stroke-width="1" opacity=".14"/><path d="M0 2L2 0M6 8L8 6M10 12L12 10" fill="none" stroke="#3E1020" stroke-width="1" opacity=".1"/></pattern></defs><rect width="${size}" height="${size}" fill="#6F1C31"/><rect width="${size}" height="${size}" fill="url(#knit)"/><g fill="#F4EBDD" stroke="#F4EBDD" stroke-width="1.2" stroke-linejoin="round">${Object.values(masks).flat().map(v=>`<path d="${v}"/>`).join('')}</g><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 1000 1000" preserveAspectRatio="none">${embedded}</svg></svg>\n`;
fs.writeFileSync(d,out);
console.log(JSON.stringify({path:d,sha256:sha(d),bytes:fs.statSync(d).size,triangles:indices.length/3,trimPolygons:counts,artwork:{center:p.center,size:p.size,safeZone:placement.sourceSafeZone},sourceSha256:sha(source)},null,2));
