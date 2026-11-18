// Directly enhances the ATEL-41 showcase GLB without rebuilding the approved shell.
// One run only; the source GLB is edited in place and tagged in glTF extras.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {readGlb,writeGlb,accessor} from './showcase-glb.mjs';

const file='showcase/products/ATEL-41/v4/assets/display.glb';
const doc=readGlb(file),g=doc.g;
if(g.extras?.atelierxCargoDetail)throw Error('Cargo detail already applied');
if(g.meshes?.length!==1)throw Error('Unexpected cargo source mesh');
const pos=accessor(doc,g.meshes[0].primitives[0].attributes.POSITION);
const cell=.006,grid=new Map();
const key=(x,y)=>`${Math.round(x/cell)},${Math.round(y/cell)}`;
for(const [x,y,z] of pos){const k=key(x,y),p=grid.get(k)||[-Infinity,Infinity];p[0]=Math.max(p[0],z);p[1]=Math.min(p[1],z);grid.set(k,p)}
function surface(x,y,front=true){
 let z=front?-Infinity:Infinity;
 for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){
  const v=grid.get(key(x+dx*cell,y+dy*cell));if(!v)continue;
  z=front?Math.max(z,v[0]):Math.min(z,v[1]);
 }
 if(Number.isFinite(z))return z;
 // Smooth front/back approximation only if a tiny local lookup misses.
 return (front?1:-1)*(.10-.03*Math.max(0,Math.abs(x)-.15)/.1);
}
function mat(name,color,rough=.77,metal=0){
 return g.materials.push({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[...color,1],roughnessFactor:rough,metallicFactor:metal}})-1;
}
const base=g.materials[0];
base.name='Sand beige cotton canvas twill';
base.pbrMetallicRoughness.baseColorFactor=[.57758,.46208,.27468,1];
base.pbrMetallicRoughness.roughnessFactor=.68;
base.pbrMetallicRoughness.metallicFactor=0;
const pocketMat=mat('Cargo pocket body · slightly deeper sand',[.44,.337,.20],.77);
const flapMat=mat('Cargo pocket flap · raised twill',[.54,.424,.265],.61);
const seamMat=mat('Seams and stitched edges',[.335,.255,.148],.91);
const loopMat=mat('Belt loops · raised sand twill',[.535,.405,.245],.65);
const hardwareMat=mat('Antique brass fasteners',[.40,.315,.18],.35,.48);

// Compact mesh builder; planar front patches get per-vertex normals from the triangles.
function builder(name,material){
 const v=[],idx=[];
 function quad(a,b,c,d){
  const i=v.length;v.push(a,b,c,d);idx.push(i,i+1,i+2,i,i+2,i+3);
 }
 function patch(x0,x1,y0,y1,front=true,lift=.004){
  const z=(x,y)=>surface(x,y,front)+(front?lift:-lift);
  quad([x0,y0,z(x0,y0)],[x1,y0,z(x1,y0)],[x1,y1,z(x1,y1)],[x0,y1,z(x0,y1)]);
 }
 function segment(a,b,width=.002,lift=.020){
  const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,px=-dy/len*width/2,py=dx/len*width/2;
  const z=(x,y)=>surface(x,y,true)+lift,steps=Math.max(1,Math.ceil(len/.012));
  for(let i=0;i<steps;i++){
   const s=i/steps,t=(i+1)/steps,A=[a[0]+dx*s,a[1]+dy*s],B=[a[0]+dx*t,a[1]+dy*t];
   quad([A[0]+px,A[1]+py,z(A[0]+px,A[1]+py)],[B[0]+px,B[1]+py,z(B[0]+px,B[1]+py)],
        [B[0]-px,B[1]-py,z(B[0]-px,B[1]-py)],[A[0]-px,A[1]-py,z(A[0]-px,A[1]-py)]);
  }
 }
 function disc(x,y,r){
  const center=v.length,z=surface(x,y,true)+.023;v.push([x,y,z]);
  for(let j=0;j<=16;j++){const a=2*Math.PI*j/16;v.push([x+Math.cos(a)*r,y+Math.sin(a)*r,z])}
  for(let j=0;j<16;j++)idx.push(center,center+j+1,center+j+2);
 }
 function save(){
  if(!idx.length)return;
  const normals=Array.from({length:v.length},()=>[0,0,0]);
  for(let i=0;i<idx.length;i+=3){const [a,b,c]=idx.slice(i,i+3),u=v[b].map((n,k)=>n-v[a][k]),w=v[c].map((n,k)=>n-v[a][k]);
   const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
   for(const j of [a,b,c])for(let k=0;k<3;k++)normals[j][k]+=n[k];
  }
  const flat=v.flat(),nf=normals.flatMap(n=>{const h=Math.hypot(...n)||1;return n.map(q=>q/h)});
  function add(data,type,count,componentType=5126){
   const bytes=Buffer.alloc(data.length*4);data.forEach((x,i)=>componentType===5126?bytes.writeFloatLE(x,i*4):bytes.writeUInt32LE(x,i*4));
   const off=(doc.bin.length+3)&~3;doc.bin=Buffer.concat([doc.bin,Buffer.alloc(off-doc.bin.length),bytes]);
   const view=g.bufferViews.push({buffer:0,byteOffset:off,byteLength:bytes.length,target:componentType===5125?34963:34962})-1;
   return g.accessors.push({bufferView:view,componentType,count,type,...(type==='VEC3'?{min:[Math.min(...v.map(p=>p[0])),Math.min(...v.map(p=>p[1])),Math.min(...v.map(p=>p[2]))],max:[Math.max(...v.map(p=>p[0])),Math.max(...v.map(p=>p[1])),Math.max(...v.map(p=>p[2]))]}:{})})-1;
  }
  const p=add(flat,'VEC3',v.length),n=add(nf,'VEC3',v.length),ix=add(idx,'SCALAR',idx.length,5125);
  const mesh=g.meshes.push({name,primitives:[{attributes:{POSITION:p,NORMAL:n},indices:ix,material}]})-1;
  const node=g.nodes.push({name,mesh})-1;g.scenes[g.scene||0].nodes.push(node);
 }
 return {quad,patch,segment,disc,save};
}

// Wide cargo bags with small visible side gussets and a separate overlapping flap.
const pockets=builder('Two raised thigh cargo pocket bags',pocketMat);
const flaps=builder('Two folded cargo pocket flaps',flapMat);
const seams=builder('Pocket, fly and leg stitching',seamMat);
const loops=builder('Six belt loops',loopMat);
const fasteners=builder('Front button and pocket snaps',hardwareMat);
for(const side of [-1,1]){
 const x=side*.176,left=x-.049,right=x+.049,low=.475,high=.627;
 pockets.patch(left,right,low,high,true,.014);
 // Raised folded bottom edge and a deeper fold to separate the bag from the leg.
 pockets.patch(left+.003,right-.003,low,low+.013,true,.018);
 flaps.patch(left-.005,right+.005,high-.033,high+.013,true,.020);
 flaps.patch(left-.005,right+.005,high-.033,high-.025,true,.024);
 for(const [a,b] of [
  [[left+.006,low+.008],[right-.006,low+.008]],
  [[left+.006,low+.008],[left+.006,high-.040]],
  [[right-.006,low+.008],[right-.006,high-.040]],
  [[left+.006,high-.025],[right-.006,high-.025]],
  [[x,low+.025],[x,high-.05]]
 ])seams.segment(a,b,.0018);
 fasteners.disc(x,high-.012,.004);
 // A subtle pressed crease and cuff seam; the source already carries drawcords.
 seams.segment([side*.140,.43],[side*.140,.14],.0014,.003);
 seams.segment([side*.065,.075],[side*.228,.075],.0023,.004);
}
// Raised waistband edges, fly line, button and belt loops.
seams.segment([-.228,.743],[.228,.743],.0022,.005);
seams.segment([0,.752],[0,.783],.0025,.006);
fasteners.disc(0,.781,.0055);
for(const x of [-.108,-.035,.035,.108]){
 loops.patch(x-.006,x+.006,.748,.784,true,.008);
 seams.segment([x-.004,.752],[x+.004,.752],.0015,.013);
 seams.segment([x-.004,.781],[x+.004,.781],.0015,.013);
}
for(const x of [-.108,.108])loops.patch(x-.006,x+.006,.748,.784,false,.008);
for(const m of [pockets,flaps,seams,loops,fasteners])m.save();
g.extras={...(g.extras||{}),atelierxCargoDetail:'v2 · raised pockets, flaps, conforming stitching, six belt loops, fly, brass buttons and differentiated twill materials'};
writeGlb(file,doc);
console.log(JSON.stringify({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),meshes:g.meshes.length,materials:g.materials.length,size:fs.statSync(file).size}));
