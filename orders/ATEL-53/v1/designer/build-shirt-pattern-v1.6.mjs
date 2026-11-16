import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeGlb} from '../../../../tools/showcase-glb.mjs';

// ATEL-53 v1.6: independently authored pattern-piece topology. Each body and
// sleeve panel has a paper-pattern domain; shared boundary samplers define
// shoulder/armhole/underarm seams. No bodyPoint shell, tube primitive, or old
// revision geometry is reused.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const groups=[];
const part=name=>{const g={name,p:[],n:[],uv:[],idx:[]};groups.push(g);return g;};
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const vert=(g,p,n,uv)=>{g.p.push(...p);g.n.push(...norm(n));g.uv.push(...uv);return g.p.length/3-1;};
const tri=(g,a,b,c)=>g.idx.push(a,b,c);
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);},gauss=(x,m,s)=>Math.exp(-(((x-m)/s)**2));
function grid(g,rows,cols,point,normal,flip=false){const ids=[];for(let r=0;r<=rows;r++){ids[r]=[];for(let c=0;c<=cols;c++){const u=c/cols,v=r/rows;ids[r][c]=vert(g,point(u,v),normal(u,v),[u,1-v]);}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],d=ids[r+1][c],e=ids[r+1][c+1];if(flip){tri(g,a,b,d);tri(g,b,e,d);}else{tri(g,a,d,b);tri(g,b,d,e);}}}
function surfaceNormal(point,u,v,sign=1){const e=.001,ua=point(clamp(u-e),v),ub=point(clamp(u+e),v),va=point(u,clamp(v-e)),vb=point(u,clamp(v+e)),n=cross(ub.map((x,i)=>x-ua[i]),vb.map((x,i)=>x-va[i]));return norm(n.map(x=>x*sign));}

const hemY=.40,armV=.965,shoulderU=.675;
const maxPatternU=v=>shoulderU+(1-shoulderU)*smooth((1-v)/(.035));
const topY=(front,u)=>{
  const neck=front?1.285:1.34;
  if(u<.20)return neck+(1.38-neck)*smooth(u/.20);
  if(u<shoulderU)return 1.38+.04*smooth((u-.20)/(shoulderU-.20));
  return 1.42-.38*smooth((u-shoulderU)/(1-shoulderU));
};
const halfWidth=y=>y<.58?.215-.018*smooth((y-.40)/.18):y<1.02?.197+.043*smooth((y-.58)/.44):y<1.30?.240-.026*smooth((y-1.02)/.28):.214+.035*smooth((y-1.30)/.12);
function irregularDrape(x,y,front){
  let z=0;
  // Short asymmetric tension folds start at the sleeve seam and soften across
  // chest/side; isolated lower folds avoid a continuous waist ridge.
  const lines=front?[[1.24,.76,.215,.135,.011,.029,.5],[1.12,.63,.226,.176,.008,.024,2.2],[.91,.53,.186,.105,.006,.026,4.1]]:[[1.20,.72,.215,.145,.009,.030,1.5],[1.02,.60,.225,.180,.007,.024,3.4]];
  for(const [ys,ye,xs,xe,a,w,phase] of lines){const t=(ys-y)/(ys-ye),skew=x<0?1:-.58,l=xs+(xe-xs)*t+skew*.016*Math.sin(phase+4*t);if(t>-.05&&t<1.05){const q=gauss(Math.abs(x),l,w)*gauss(t,.48,.64);z+=a*q-a*.52*gauss(Math.abs(x),l+w*.95,w*.64)*gauss(t,.5,.66);}}
  // Local diagonal drag from underarm toward the side waist; avoid a belt-like
  // circumferential crease across the body.
  z+=.0035*gauss(Math.abs(x),.118+.18*(.90-y),.018)*gauss(y,.76,.11);
  return (front?1:-1)*z;
}
function bodyPatternPoint(front,side,pu,v){
  const u=pu*maxPatternU(v),top=topY(front,u),y=hemY+(top-hemY)*v;
  const w=halfWidth(y),x=side*u*w;
  let zside=(.082+.014*gauss(y,1.0,.24))*Math.sqrt(Math.max(.12,1-.55*(x/w)**2));
  // Front and back paper pieces meet exactly along the shoulder seam: their
  // depth eases to the shared seam line only in the sewn shoulder region.
  const shoulderJoin=smooth((v-.88)/.12)*smooth((u-.15)/.05);
  zside*=1-shoulderJoin;
  const fold=irregularDrape(x,y,front);
  // Chest and side shaping are broad/irregular and panel-specific.
  const ease=.0008*Math.sin(u*Math.PI*2+v*2.1)*(1-v)*gauss(y,1.0,.24);
  return [x,y,(front?1:-1)*(zside+Math.abs(fold))+ease];
}
function torsoPointActual(front,side,u,v){const edge=maxPatternU(v);return bodyPatternPoint(front,side,u/edge,v);}
const torsoOuterEdge=(front,side,v)=>bodyPatternPoint(front,side,1,v);
for(const front of [true,false])for(const side of [-1,1]){
  const name=`${front?'Front':'Back'} pattern panel ${side<0?'L':'R'}`,g=part(name);
  const point=(u,v)=>bodyPatternPoint(front,side,u,v);
  const sign=side*(front?1:-1);
  grid(g,68,64,point,(u,v)=>surfaceNormal(point,u,v,sign),front?side>0:side<0);
}

// Shared side-seam strip: both body panel edge samplers feed the same ruled
// sewn seam surface only below the armhole end.
for(const side of [-1,1]){
  const g=part(`Sewn side seam allowance ${side<0?'L':'R'}`);
  const point=(u,v)=>{const vv=v*armV,f=torsoOuterEdge(true,side,vv),b=torsoOuterEdge(false,side,vv);return f.map((x,i)=>x+(b[i]-x)*u);};
  grid(g,56,8,point,()=>[side,0,0]);
}

// Armhole boundary is a single shared perimeter sampled from the torso
// pattern edges. Two sleeve pattern pieces reference this exact perimeter.
function armhole(side,a){
  if(a<.45){const t=smooth(a/.45);return torsoOuterEdge(true,side,1-(1-armV)*t);}
  if(a<.55){const t=(a-.45)/.10,f=torsoOuterEdge(true,side,armV),b=torsoOuterEdge(false,side,armV);return f.map((x,i)=>x+(b[i]-x)*t);}
  const t=smooth((a-.55)/.45);return torsoOuterEdge(false,side,armV+(1-armV)*t);
}
function sleevePatternPoint(side,t,a){
  const rootEdge=armhole(side,a);
  const angle=2*Math.PI*a;
  const center=[side*(.155+.285*t),1.36-.765*t,0];
  const rx=.105-.027*t,rz=.082-.021*t;
  const drafted=[center[0]+side*rx*Math.cos(angle),center[1]+.36*rx*Math.cos(angle),rz*Math.sin(angle)];
  const blend=smooth(t/.20);
  const p=rootEdge.map((x,i)=>x*(1-blend)+drafted[i]*blend);
  // Unequal elbow/wrist drag folds, seeded at the elbow and forearm seam.
  const sleeveFold=.012*gauss(t,.46,.075)*Math.cos(angle*2.4+side*.8)+.008*gauss(t,.74,.085)*Math.cos(angle*3.1+side);
  p[0]+=side*.62*sleeveFold*Math.cos(angle);p[1]+=.25*sleeveFold*Math.cos(angle);p[2]+=sleeveFold*Math.sin(angle);
  return p;
}
for(const side of [-1,1])for(const half of [0,1]){
  const a0=half*.5,a1=(half+1)*.5;
  const g=part(`Set-in sleeve pattern ${half===0?'front':'back'} ${side<0?'L':'R'}`);
  const point=(u,v)=>sleevePatternPoint(side,v,a0+(a1-a0)*u);
  grid(g,64,36,point,(u,v)=>surfaceNormal(point,u,v,1),half===0);
}
// Open cuff bands share the terminal sleeve edge; no cuff cap.
for(const side of [-1,1]){
  const g=part(`Open cuff facing ${side<0?'L':'R'}`);
  const point=(u,v)=>{const a=u,t=.92+.08*v,p=sleevePatternPoint(side,t,a),c=[side*(.155+.285*t),1.36-.765*t,0];return p.map((x,i)=>x+(x-c[i])*.045);};
  grid(g,12,56,point,(u,v)=>{const a=2*Math.PI*u;return norm([side*.45*Math.cos(a),.18*Math.cos(a),Math.sin(a)]);});
}

// Neckline perimeter from front center, around the nape and back to the other
// front edge; a narrow stand follows that exact open rim without covering it.
function neckEdge(a){
  const seg=Math.min(5,Math.floor(a*6)),t=a*6-seg,u=.20;
  if(seg===0){const q=u*t;return torsoPointActual(true,1,q,1);}
  if(seg===1){const p=torsoPointActual(true,1,u,1),b=torsoPointActual(false,1,u,1);return p.map((x,i)=>x+(b[i]-x)*t);}
  if(seg===2){const q=u*(1-t);return torsoPointActual(false,1,q,1);}
  if(seg===3){const q=u*t;return torsoPointActual(false,-1,q,1);}
  if(seg===4){const p=torsoPointActual(false,-1,u,1),f=torsoPointActual(true,-1,u,1);return p.map((x,i)=>x+(f[i]-x)*t);}
  if(seg===5){const q=u*(1-t);return torsoPointActual(true,-1,q,1);}
}
const stand=part('Pattern-piece collar stand');
const standPoint=(u,v)=>{const p=neckEdge(u),s=(p[2]>=0?1:-1);return [p[0],p[1]+.001+.014*v,p[2]+s*.002*v];};
grid(stand,10,112,standPoint,(u,v)=>{const a=u*2*Math.PI;return norm([Math.cos(a),.15,Math.sin(a)]);});
for(const side of [-1,1]){
  const g=part(`Folded broad collar leaf ${side<0?'L':'R'}`);
  const point=(u,v)=>{
    const actual=.20*u,base=torsoPointActual(true,side,actual,1);
    // Leaf pattern is broad and asymmetrically flared; hinge follows the front
    // neckline/stand, lower edge folds outward over chest rather than downward.
    const bx=base[0],by=base[1],bz=base[2];
    const tx=side*(.19+.045*u),ty=1.215-.035*u;
    const x=bx*(1-v)+tx*v+side*.012*Math.sin(Math.PI*v)*Math.sin(Math.PI*u);
    const y=by*(1-v)+ty*v+.018*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
    const z=.090*Math.sqrt(Math.max(.2,1-(x/.24)**2))+irregularDrape(x,y,true)+.005+.018*Math.sin(Math.PI*u)*Math.sin(Math.PI*v)+.004*v;
    return [x,y,z];
  };
  grid(g,36,32,point,(u,v)=>surfaceNormal(point,u,v,-1));
}

// Center-front textile placket follows the front shell. Trial buttons are
// mounted on its local normal in neutral gray for shape review only.
const frontZ=(x,y)=>.082*Math.sqrt(Math.max(.12,1-.55*(x/Math.max(halfWidth(y),.01))**2))+irregularDrape(x,y,true);
{
  const g=part('Pattern-piece center front placket');
  const point=(u,v)=>{const y=hemY+.735*v,x=(u-.5)*.038;return [x,y,frontZ(x,y)+.004+.001*Math.abs(u-.5)];};
  grid(g,56,8,point,()=>[0,0,1]);
}
function addButton(name,center,normal,r=.008){
  const g=part(name),n=norm(normal),ref=Math.abs(n[1])>.9?[1,0,0]:[0,1,0],u=norm(cross(ref,n)),v=norm(cross(n,u)),N=16,t=.002;
  const a0=[],a1=[];for(let i=0;i<N;i++){const a=2*Math.PI*i/N,p=center.map((x,k)=>x+u[k]*r*Math.cos(a)+v[k]*r*Math.sin(a));a0.push(vert(g,p,n,[i/N,0]));a1.push(vert(g,p.map((x,k)=>x+n[k]*t),n,[i/N,1]));}
  const c0=vert(g,center,n,[.5,.5]),c1=vert(g,center.map((x,k)=>x+n[k]*t),n,[.5,.5]);
  for(let i=0;i<N;i++){const j=(i+1)%N;tri(g,c0,a0[j],a0[i]);tri(g,c1,a1[i],a1[j]);tri(g,a0[i],a0[j],a1[i]);tri(g,a0[j],a1[j],a1[i]);}
}
for(const y of [.53,.67,.81,.95,1.09,1.17])addButton(`Gray placket test button ${y.toFixed(2)}`,[0,y,frontZ(0,y)+.008],[0,0,1],.008);
for(const side of [-1,1]){const p=sleevePatternPoint(side,.955,0),n=norm([side*.94,.34,0]);addButton(`Gray cuff test button ${side<0?'L':'R'}`,p.map((x,i)=>x+n[i]*.003),n,.007);}

const matNames=['Neutral gray shirt shell','Collar/placket textile','Open cuff facing','Neutral gray trial buttons'];
const materialOf=name=>/button/i.test(name)?3:/cuff/i.test(name)?2:/collar|placket/i.test(name)?1:0;
const materials=matNames.map((name,i)=>({name,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:i===3?[.19,.20,.21,1]:[.26,.27,.28,1],metallicFactor:0,roughnessFactor:.9}}));
let bin=Buffer.alloc(0);const views=[],accessors=[];
function view(bytes,target){const offset=(bin.length+3)&~3;bin=Buffer.concat([bin,Buffer.alloc(offset-bin.length),bytes]);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,...(target?{target}:{})});return views.length-1;}
function accessor(bytes,type,count,shape,target){accessors.push({bufferView:view(bytes,target),componentType:type,count,type:shape});return accessors.length-1;}
const meshes=[],nodes=[];
for(const g of groups){const pos=new Float32Array(g.p),nor=new Float32Array(g.n),uv=new Float32Array(g.uv),idx=new Uint32Array(g.idx),min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<pos.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],pos[i+k]);max[k]=Math.max(max[k],pos[i+k]);}const p=accessor(Buffer.from(pos.buffer),5126,pos.length/3,'VEC3',34962),n=accessor(Buffer.from(nor.buffer),5126,nor.length/3,'VEC3',34962),t=accessor(Buffer.from(uv.buffer),5126,uv.length/2,'VEC2',34962),ii=accessor(Buffer.from(idx.buffer),5125,idx.length,'SCALAR',34963);accessors[p].min=min;accessors[p].max=max;meshes.push({name:g.name,primitives:[{attributes:{POSITION:p,NORMAL:n,TEXCOORD_0:t},indices:ii,material:materialOf(g.name),mode:4}]});nodes.push({name:g.name,mesh:meshes.length-1});}
const all=groups.flatMap(g=>g.p),bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<all.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],all[i+k]);bounds[1][k]=Math.max(bounds[1][k],all[i+k]);}
const rawNodes=nodes.map((_,i)=>i),rootIndex=nodes.length;nodes.push({name:'Display proportion normalization · shirt reference envelope',children:rawNodes,translation:[0,.42,0],scale:[1,.72,1]});
const shownBounds={min:[bounds[0][0],bounds[0][1]*.72+.42,bounds[0][2]],max:[bounds[1][0],bounds[1][1]*.72+.42,bounds[1][2]]};
const gltf={asset:{version:'2.0',generator:'AtelierX ATEL-53 pattern-panel sewn-shell v1.6',extras:{atelierxStandalone:{orderId:'ATEL-53',revision:'v1.6-gray-candidate',status:'candidate for Lead review; not shape-approved',geometryOrigin:'Fresh panel-pattern mesh authored for this order; no prior geometry or source mesh reused.',construction:{body:'Four front/back pattern panels with shaped open neckline, cut armholes and unclosed hem.',sleeves:'Separate front/back set-in sleeve pattern panels use the same sampled torso armhole perimeter; cuff rims remain open.',seams:'Shoulder panels converge on a shared seam line; front/back side edges use sewn seam allowances below the armhole.',collar:'Narrow collar-stand pattern follows neckline loop; broad folded collar leaves flare outward over chest.',buttons:'Neutral gray low-profile trial buttons attached to placket and cuff normals.'},uv:{origin:'glTF upper-left',body:'Pattern U centerline to side seam; V hem to shoulder.',sleeves:'Pattern U around sleeve seam; V shoulder to open cuff.',materialGroups:groups.map(g=>g.name)},displayBoundsMeters:shownBounds,displayTransform:{translation:[0,.42,0],scale:[1,.72,1]},notManufacturingSize:true}}},scene:0,scenes:[{name:'ATEL-53 gray shirt · sewn pattern panels',nodes:[rootIndex]}],nodes,meshes,materials,buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
const out='orders/ATEL-53/v1/designer/garment-gray-v1.6-wip.glb';fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});writeGlb(path.join(root,out),{g:gltf,bin});
console.log(JSON.stringify({out,parts:groups.map(g=>g.name),vertices:all.length/3,triangles:groups.reduce((s,g)=>s+g.idx.length/3,0),bounds:shownBounds},null,2));
