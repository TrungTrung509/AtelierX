import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeGlb} from '../../../../tools/showcase-glb.mjs';

// New neutral shirt shell authored for ATEL-53 from the owner brief.
// It is made from front/back cloth panels, swept sleeves, sewn collar pieces,
// folded placket and open cuff bands. No source garment or body is used.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const groups=[];
const part=name=>{const g={name,p:[],n:[],uv:[],idx:[]};groups.push(g);return g;};
const norm=n=>{const l=Math.hypot(...n)||1;return n.map(v=>v/l);};
const vert=(g,p,n,uv)=>{g.p.push(...p);g.n.push(...norm(n));g.uv.push(...uv);return g.p.length/3-1;};
const tri=(g,a,b,c)=>g.idx.push(a,b,c);
const grid=(g,rows,cols,point,normal,uv=(u,v)=>[u,1-v],flip=false)=>{const ids=[];for(let r=0;r<=rows;r++){ids[r]=[];for(let c=0;c<=cols;c++){const u=c/cols,v=r/rows;ids[r][c]=vert(g,point(u,v),normal(u,v),uv(u,v));}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],d=ids[r+1][c],e=ids[r+1][c+1];if(flip){tri(g,a,b,d);tri(g,b,e,d);}else{tri(g,a,d,b);tri(g,b,d,e);}}};
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);},gauss=(x,m,s)=>Math.exp(-(((x-m)/s)**2));
const width=y=>y<.62?.226-.022*smooth((y-.38)/.24):y<1.03?.204+.038*smooth((y-.62)/.41):y<1.27?.242-.029*smooth((y-1.03)/.24):.213+.088*smooth((y-1.27)/.17);
const topY=(u,front)=>{
  const neck=front?1.30:1.37;
  const shoulder=1.42,shoulderEdge=1.385,armhole=1.025;
  if(u<.42)return neck+(shoulder-neck)*smooth(u/.42);
  if(u<2/3)return shoulder-(shoulder-shoulderEdge)*smooth((u-.42)/(2/3-.42));
  return shoulderEdge-(shoulderEdge-armhole)*smooth((u-2/3)/(1/3));
};
function folds(x,y,front){
  const ax=Math.abs(x);
  // A few tension folds radiate from the armhole and side seam; each has a
  // broad valley and a sharper raised ridge, rather than regular rippling.
  let z=0;
  for(const [startY,endY,fromX,toX,amp] of [[1.025,.47,.208,.151,.010],[.98,.40,.222,.188,.006]]){
    const t=(startY-y)/(startY-endY),line=fromX+(toX-fromX)*t;
    if(t>-.12&&t<1.12){const band=gauss(ax,line,.036)*gauss(t,.52,.74);z+=amp*band-amp*.42*gauss(ax,line+.042,.024)*gauss(t,.52,.74);}
  }
  z+=.0025*gauss(y,.405,.026)*gauss(ax,.13,.15);
  return (front?1:-1)*z;
}
function bodyPoint(front,side,u,v){
  const bottom=.375,top=topY(u,front),y=bottom+(top-bottom)*v;
  const center=front?.007:0;
  const x=side*(center+u*(width(y)-center));
  const q=Math.sqrt(Math.max(.05,1-(x/Math.max(width(y),.01))**2));
  const depth=(.091+.009*gauss(y,.99,.21))*q;
  const z=(front?1:-1)*(depth+folds(x,y,front));
  return [x,y,z];
}
function frontSurfaceZ(x,y){return .091*Math.sqrt(Math.max(.05,1-(x/Math.max(width(y),.01))**2))+folds(x,y,true);}
function bodyNormal(front,side,u,v){const e=.001,p=(a,b)=>bodyPoint(front,side,clamp(a),clamp(b)),ua=p(u-e,v),ub=p(u+e,v),va=p(u,v-e),vb=p(u,v+e),a=ub.map((x,i)=>x-ua[i]),b=vb.map((x,i)=>x-va[i]),n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],sign=side*(front?1:-1);return norm(n.map(x=>x*sign));}
for(const front of [true,false])for(const side of [-1,1]){
  const g=part(`${front?'Front':'Back'} cloth panel ${side<0?'L':'R'}`);
  grid(g,54,84,(u,v)=>bodyPoint(front,side,u,v),(u,v)=>bodyNormal(front,side,u,v),(u,v)=>[u,1-v],front?side>0:side<0);
}
// Sew the upper front/back panel edges from the neckline out to the shoulder.
// The bridge stops before the armhole so sleeve openings remain clear.
for(const side of [-1,1]){
  const g=part(`Shoulder seam panel ${side<0?'L':'R'}`);
  grid(g,24,24,(u,v)=>{const across=.30+(2/3-.30)*u,f=bodyPoint(true,side,across,1),b=bodyPoint(false,side,across,1);return f.map((x,i)=>x+(b[i]-x)*v);},()=>[0,1,0],(u,v)=>[u,v]);
}
// Side seams join front and back edges only below the cut armhole, leaving a
// real arm opening. Thin seam allowances follow the tailored side contour.
for(const side of [-1,1]){
  const g=part(`Side seam ${side<0?'L':'R'}`);
  grid(g,42,8,(u,v)=>{const front=bodyPoint(true,side,1,v),back=bodyPoint(false,side,1,v);return front.map((q,i)=>q+(back[i]-q)*u);},()=>[side,0,0]);
}
// Sewn sleeve tube. Its open root ring follows the body armhole boundary;
// the distal ring remains open inside an outer cuff band.
function armhole(side,a){
  const front=a<.5, q=front?a*2:2-2*a, u=2/3+(1/3)*q;
  return bodyPoint(front,side,u,1);
}
function sleevePoint(side,t,a){
  const rootP=armhole(side,a);
  const axis=[side*.342,-.940,0],cross=[side*.940,.342,0];
  const center=[side*(.246+.195*t),1.22-.675*t,0];
  const angle=2*Math.PI*a,rx=.16-.10*t,rz=.10-.055*t;
  const tube=[center[0]+cross[0]*rx*Math.cos(angle),center[1]+cross[1]*rx*Math.cos(angle),rz*Math.sin(angle)];
  const blend=smooth(t/.36);
  let p=rootP.map((x,i)=>x*(1-blend)+tube[i]*blend);
  // Elbow and forearm folds gather around a bent sleeve axis.
  const gathered=(.011*gauss(t,.56,.075)*Math.cos(angle*2.7+side*.4)+.007*gauss(t,.76,.09)*Math.cos(angle*3.5));
  p[0]+=cross[0]*gathered*Math.cos(angle);p[1]+=cross[1]*gathered*Math.cos(angle);p[2]+=gathered*Math.sin(angle);
  return p;
}
for(const side of [-1,1]){
  const sleeve=part(`Sleeve cloth ${side<0?'L':'R'}`);
  grid(sleeve,60,56,(u,v)=>sleevePoint(side,v,u),(u,v)=>{const a=2*Math.PI*u;return norm([side*.94*Math.cos(a),.342*Math.cos(a),Math.sin(a)]);},(u,v)=>[u,1-v]);
  const cuff=part(`Open cuff band ${side<0?'L':'R'}`);
  grid(cuff,10,64,(u,v)=>{const p=sleevePoint(side,.91+.09*v,u);const c=[side*(.246+.195*(.91+.09*v)),1.22-.675*(.91+.09*v),0];return p.map((x,i)=>x+(x-c[i])*.055);},(u,v)=>{const a=2*Math.PI*u;return norm([side*.34*Math.cos(a),.94*Math.cos(a),Math.sin(a)]);},(u,v)=>[u,1-v]);
}
// The collar stand follows a U-shaped neck path over the front and back
// neckline edges. Leaves are sewn folded panels with a shallow center crease.
function neckPoint(a,raised=0){
  const seg=Math.min(5,Math.floor(a*6)),t=(a*6)-seg,u=.30;
  let p;
  if(seg===0)p=bodyPoint(true,1,u*t,1);
  else if(seg===1){const f=bodyPoint(true,1,u,1),b=bodyPoint(false,1,u,1);p=f.map((x,i)=>x+(b[i]-x)*t);}
  else if(seg===2)p=bodyPoint(false,1,u*(1-t),1);
  else if(seg===3)p=bodyPoint(false,-1,u*t,1);
  else if(seg===4){const b=bodyPoint(false,-1,u,1),f=bodyPoint(true,-1,u,1);p=b.map((x,i)=>x+(f[i]-x)*t);}
  else p=bodyPoint(true,-1,u*(1-t),1);
  const sideSign=p[2]===0?0:Math.sign(p[2]);
  return [p[0],p[1]+raised,p[2]+sideSign*raised*.12];
}
const stand=part('Collar stand cloth band');
grid(stand,6,96,(u,v)=>neckPoint(u,.001+v*.014), (u,v)=>{const a=u*2*Math.PI;return norm([Math.sin(a),.28,Math.cos(a)]);},(u,v)=>[u,1-v]);
for(const side of [-1,1]){
  const leaf=part(`Folded collar leaf ${side<0?'L':'R'}`);
  grid(leaf,24,18,(u,v)=>{
    const edge=bodyPoint(true,side,.30*u,1),tipX=side*(.025+.020*u),tipY=1.245+.010*u,tip=[tipX,tipY,frontSurfaceZ(tipX,tipY)+.012];
    const x=edge[0]*(1-v)+tip[0]*v,y=(edge[1]+.014)*(1-v)+tip[1]*v;
    // Broad, short lower edge keeps each leaf folded onto the shirt chest.
    const z=edge[2]*(1-v)+tip[2]*v+.006*Math.sin(Math.PI*v)*(.35+.65*u);
    return [x,y,z];
  },(u,v)=>norm([side*.12,.18,1]),(u,v)=>[u,1-v]);
}
// Folded, shaped center placket follows the body surface. It is textile, not
// a rigid bar; decorative buttons are intentionally omitted from gray review.
{
  const p=part('Folded center-front placket');
  grid(p,48,10,(u,v)=>{const y=.405+.755*v,x=(u-.5)*.042,z=.091*Math.sqrt(Math.max(.05,1-(x/width(y))**2))+folds(x,y,true)+.005+.002*Math.abs(u-.5);return [x,y,z];},()=>[0,0,1],(u,v)=>[u,1-v]);
}

const matNames=['Neutral gray shirt shell','Collar and placket seam allowances','Cuff bands'];
const materialOf=name=>/collar|placket/i.test(name)?1:/cuff/i.test(name)?2:0;
const materials=matNames.map(name=>({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[.26,.27,.28,1],metallicFactor:0,roughnessFactor:.9}}));
let bin=Buffer.alloc(0);const views=[],accessors=[];
function view(bytes,target){const offset=(bin.length+3)&~3;bin=Buffer.concat([bin,Buffer.alloc(offset-bin.length),bytes]);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,...(target?{target}:{})});return views.length-1;}
function accessor(bytes,type,count,shape,target){accessors.push({bufferView:view(bytes,target),componentType:type,count,type:shape});return accessors.length-1;}
const meshes=[],nodes=[];
for(const g of groups){
  const positions=new Float32Array(g.p),normals=new Float32Array(g.n),uvs=new Float32Array(g.uv),indices=new Uint32Array(g.idx);
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],positions[i+k]);max[k]=Math.max(max[k],positions[i+k]);}
  const p=accessor(Buffer.from(positions.buffer),5126,positions.length/3,'VEC3',34962),n=accessor(Buffer.from(normals.buffer),5126,normals.length/3,'VEC3',34962),uv=accessor(Buffer.from(uvs.buffer),5126,uvs.length/2,'VEC2',34962),idx=accessor(Buffer.from(indices.buffer),5125,indices.length,'SCALAR',34963);
  accessors[p].min=min;accessors[p].max=max;meshes.push({name:g.name,primitives:[{attributes:{POSITION:p,NORMAL:n,TEXCOORD_0:uv},indices:idx,material:materialOf(g.name),mode:4}]});nodes.push({name:g.name,mesh:meshes.length-1});
}
const all=groups.flatMap(g=>g.p),bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<all.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],all[i+k]);bounds[1][k]=Math.max(bounds[1][k],all[i+k]);}
const rawNodes=nodes.map((_,i)=>i),rootIndex=nodes.length;
nodes.push({name:'Display proportion normalization · shirt reference envelope',children:rawNodes,translation:[0,.42,0],scale:[1,.72,1]});
const shownBounds={min:[bounds[0][0],bounds[0][1]*.72+.42,bounds[0][2]],max:[bounds[1][0],bounds[1][1]*.72+.42,bounds[1][2]]};
const gltf={asset:{version:'2.0',generator:'AtelierX ATEL-53 tailored cloth shell v1',extras:{atelierxStandalone:{orderId:'ATEL-53',revision:'v1-gray-wip',status:'prototype checkpoint; not shape-approved',geometryOrigin:'Fresh procedural garment panels authored from owner brief; no prior geometry or source mesh reused.',construction:{frontBackPanels:'Four separately named cloth panels with open neckline, underarm armhole boundary, placket split, and unclosed hem.',sideSeams:'Front/back edges joined below armhole by narrow textile seam allowance.',sleeves:'Swept cloth tubes with open cuffs; root rings track the torso armhole curve.',collar:'Neck-following stand ribbon and two folded leaf panels; no horizontal neck cap.',decorativeButtons:'Omitted until shape is reviewed; placket geometry included.'},uv:{semantic:'TEXCOORD_0; UV origin upper-left.',body:'Each panel U center-front/back to side seam; V shoulder to hem.',sleeves:'U wraps around circumference; V runs shoulder to cuff.',trim:'Separate material groups for collar/placket and cuffs.'},materialGroups:groups.map(g=>g.name),displayBoundsMeters:shownBounds,displayTransform:{translation:[0,.42,0],scale:[1,.72,1]},notManufacturingSize:true}}},scene:0,scenes:[{name:'ATEL-53 gray shirt · standalone',nodes:[rootIndex]}],nodes,meshes,materials,buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
const out='orders/ATEL-53/v1/designer/garment-gray-v1-wip.glb';fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});writeGlb(path.join(root,out),{g:gltf,bin});
console.log(JSON.stringify({out,groups:groups.map(g=>g.name),vertices:all.length/3,triangles:groups.reduce((n,g)=>n+g.idx.length/3,0),bounds:shownBounds,dimensionsCm:shownBounds.min.map((x,i)=>Math.round((shownBounds.max[i]-x)*1000)/10)},null,2));
