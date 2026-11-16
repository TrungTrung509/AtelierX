import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeGlb} from '../../../../tools/showcase-glb.mjs';

// ATEL-47 v4 is freshly authored from the brief. The torso is a continuous
// front/back shell with a closed shoulder bridge; sleeves are capped inside
// the torso so their visible roots emerge without open armhole boundaries.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const groups=[];
const part=name=>{const g={name,p:[],n:[],uv:[],idx:[]};groups.push(g);return g;};
const vert=(g,p,n,uv)=>{const m=Math.hypot(...n)||1;g.p.push(...p);g.n.push(...n.map(x=>x/m));g.uv.push(...uv);return g.p.length/3-1;};
const tri=(g,a,b,c)=>g.idx.push(a,b,c);
const grid=(g,rows,cols,point,normal,uv=(u,v)=>[u,1-v])=>{const ids=[];for(let r=0;r<=rows;r++){ids[r]=[];for(let c=0;c<=cols;c++){const u=c/cols,v=r/rows;ids[r][c]=vert(g,point(u,v),normal(u,v),uv(u,v));}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],d=ids[r+1][c],e=ids[r+1][c+1];tri(g,a,d,b);tri(g,b,d,e);}};
const lerp=(a,b,t)=>a+(b-a)*t;const clamp=x=>Math.max(0,Math.min(1,x));const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function widthAt(y){const t=clamp((y-.33)/.60);if(t<.28)return lerp(.218,.202,smooth(t/.28));if(t<.72)return lerp(.202,.243,smooth((t-.28)/.44));return lerp(.243,.252,smooth((t-.72)/.28));}
function depthAt(y){const t=clamp((y-.33)/.60);return t<.55?lerp(.075,.088,smooth(t/.55)):lerp(.088,.078,smooth((t-.55)/.45));}
function necklineY(x,front){return .910-(front?.050:.042)*Math.exp(-((x/.075)**2));}
function drape(x,y,front){const w=Math.exp(-(((y-.50)/.15)**2));const side=Math.exp(-(((Math.abs(x)-.155)/.055)**2));return w*(.0045*side*Math.sin(26*y+9*x+(front?0:1.1))+.0022*Math.sin(18*y+7*x+(front?0:1.1)))+.0015*Math.sin(14*x+20*y)*Math.exp(-(((y-.36)/.045)**2));}
function bodyPoint(front,x,y,extra=0){const w=widthAt(y),q=clamp(1-(x/w)**2),z=depthAt(y)*Math.sqrt(q)+drape(x,y,front)+extra;return [x,y,front?z:-z];}
function bodyNormal(front,u,v){const e=.001,p=(a,b)=>{const x=(a*2-1)*widthAt(lerp(.33,.92,b)),y=lerp(.33,necklineY((a*2-1)*widthAt(.92),front),b);return bodyPoint(front,x,y);},u0=p(clamp(u-e),v),u1=p(clamp(u+e),v),v0=p(u,clamp(v-e)),v1=p(u,clamp(v+e));const a=u1.map((x,i)=>x-u0[i]),b=v1.map((x,i)=>x-v0[i]),n=[b[1]*a[2]-b[2]*a[1],b[2]*a[0]-b[0]*a[2],b[0]*a[1]-b[1]*a[0]],len=Math.hypot(...n)||1;return n.map(x=>x/len);}
function topPoint(front,x){const y=necklineY(x,front);return bodyPoint(front,x,y);}
function bodyUV(u,v){return [u,1-v];}
for(const front of [true,false]){
 const g=part(front?'Front body panel':'Back body panel');
 grid(g,72,64,(u,v)=>{const x=(u*2-1)*widthAt(lerp(.33,.92,v)),y=lerp(.33,necklineY((u*2-1)*widthAt(.92),front),v);return bodyPoint(front,x,y);},(u,v)=>bodyNormal(front,u,v),bodyUV);
}
// Continuous shoulder/yoke closures seal the top boundary but leave the neck
// opening clear; the collar stand bridges the front and back neckline.
for(const [name,a,b] of [['Shoulder yoke left',-widthAt(.91),-.074],['Shoulder yoke right',.074,widthAt(.91)]]){const g=part(name);grid(g,40,20,(u,v)=>{const x=lerp(a,b,u),f=topPoint(true,x),bk=topPoint(false,x);return f.map((n,i)=>lerp(n,bk[i],v));},()=>[0,-1,0],(u,v)=>[u,v]);}
{const g=part('Neckline facing');grid(g,24,18,(u,v)=>{const x=lerp(-.074,.074,u),f=topPoint(true,x),bk=topPoint(false,x);return f.map((n,i)=>lerp(n,bk[i],v));},()=>[0,-1,0],(u,v)=>[u,v]);}
// The collar stand is built as surface strips directly on the neckline rather
// than a floating ring. The leaf upper edges share the stand's front boundary.
{const front=true,g=part('Collar stand front');grid(g,16,40,(u,v)=>{const x=lerp(-.074,.074,u),base=necklineY(x,front),y=base+.030*v,p=bodyPoint(front,x,y,.006);return p;},()=>[0,0,-1],(u,v)=>[u,1-v]);}
for(const [side,label] of [[-1,'left'],[1,'right']]){
 const g=part(`Collar leaf ${label}`);
 grid(g,36,28,(u,v)=>{const xTop=.001+.073*u,xTip=.046+.003*(u-.5),x=side*lerp(xTop,xTip,v),yTop=necklineY(xTop,true)+.030,y=lerp(yTop,.802,v),p=bodyPoint(true,x,y,.009);return [x,y,p[2]+.0015*Math.sin(Math.PI*u)*(1-v)];},()=>[0,.3,1],(u,v)=>[u,1-v]);
}
// Sleeve centerline and cross-section are rebuilt around a true swept axis.
function sleeveCenter(side,t){t=clamp(t);return [side*(.160+.200*t),.880-.470*t,0];}
function sleeveFrame(side){const axis=[side*.392,-.920,0],cross=[side*.920,.392,0];return {axis,cross,z:[0,0,1]};}
function sleeveRadius(t){return [.080-.030*t,.050-.020*t];}
function sleevePoint(side,t,a,extra=0){const c=sleeveCenter(side,t),f=sleeveFrame(side),[rx,rz]=sleeveRadius(t),ang=2*Math.PI*a;const fold=.0017*Math.sin(ang*5+t*15)+.0012*Math.sin(ang*3-t*11);return [c[0]+f.cross[0]*(rx+fold+extra)*Math.cos(ang),c[1]+f.cross[1]*(rx+fold+extra)*Math.cos(ang),c[2]+(rz+fold*.5+extra)*Math.sin(ang)];}
for(const [side,label] of [[-1,'left'],[1,'right']]){
 const g=part(`Sleeve ${label}`);grid(g,64,72,(u,v)=>sleevePoint(side,v,u),(u)=>{const a=2*Math.PI*u,f=sleeveFrame(side);return [-f.cross[0]*Math.cos(a),-f.cross[1]*Math.cos(a),-Math.sin(a)];},(u,v)=>[u,1-v]);
 const cap=part(`Sleeve root closure ${label}`);grid(cap,1,72,(u,v)=>{const edge=sleevePoint(side,0,u),c=sleeveCenter(side,0);return c.map((n,i)=>lerp(n,edge[i],v));},()=>[side*.4,-.9,0],(u,v)=>[u,v]);
 const cuff=part(`Cuff ${label}`);grid(cuff,12,72,(u,v)=>sleevePoint(side,.865+.135*v,u,.005),(u)=>{const a=2*Math.PI*u,f=sleeveFrame(side);return [-f.cross[0]*Math.cos(a),-f.cross[1]*Math.cos(a),-Math.sin(a)];},(u,v)=>[u,1-v]);
}
// Front placket is restrained and terminates under the collar. Buttons/cuff
// buttons are their own material groups for downstream surface assignment.
const placket=part('Front placket');grid(placket,56,8,(u,v)=>{const x=(u-.5)*.034,y=lerp(.39,.887,v),p=bodyPoint(true,x,y,.004);return [p[0],p[1],p[2]+.002];},()=>[0,0,-1]);
function ellipsoid(g,c,r,rows=12,cols=18){grid(g,rows,cols,(u,v)=>{const a=2*Math.PI*u,b=Math.PI*v;return [c[0]+r[0]*Math.sin(b)*Math.cos(a),c[1]+r[1]*Math.cos(b),c[2]+r[2]*Math.sin(b)*Math.sin(a)];},(u,v)=>{const a=2*Math.PI*u,b=Math.PI*v;return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];},(u,v)=>[u,1-v]);}
const buttons=part('Front buttons');for(let i=0;i<7;i++){const y=.42+i*.071,p=bodyPoint(true,0,y,.012);ellipsoid(buttons,[0,y,p[2]+.002],[.006,.006,.003],8,12);}
for(const [side,label] of [[-1,'left'],[1,'right']]){const g=part(`Cuff button ${label}`),p=sleevePoint(side,.94,.25);ellipsoid(g,[p[0],p[1],p[2]+.004],[.006,.006,.003],8,12);}
const materialOf=name=>{const n=name.toLowerCase();if(n.includes('button'))return 5;if(n.includes('cuff'))return 3;if(n.includes('sleeve'))return 1;if(n.includes('collar'))return 2;if(n.includes('placket'))return 4;return 0;};
const materialNames=['Body front/back panels and shoulder bridges','Sleeves','Collar','Cuffs','Placket','Buttons'];
const materials=materialNames.map((name,i)=>({name:`Neutral gray ${name}`,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:i===5?[.14,.15,.16,1]:[.27,.28,.29,1],metallicFactor:0,roughnessFactor:i===5?.72:.9}}));
let bin=Buffer.alloc(0);const views=[],accessors=[];
function view(bytes,target){const offset=(bin.length+3)&~3;bin=Buffer.concat([bin,Buffer.alloc(offset-bin.length),bytes]);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,...(target?{target}:{})});return views.length-1;}
function accessor(bytes,type,count,shape,target){accessors.push({bufferView:view(bytes,target),componentType:type,count,type:shape});return accessors.length-1;}
const meshes=[],nodes=[];
for(const g of groups){const p=accessor(Buffer.from(new Float32Array(g.p).buffer),5126,g.p.length/3,'VEC3',34962),n=accessor(Buffer.from(new Float32Array(g.n).buffer),5126,g.n.length/3,'VEC3',34962),uv=accessor(Buffer.from(new Float32Array(g.uv).buffer),5126,g.uv.length/2,'VEC2',34962),idx=accessor(Buffer.from(new Uint32Array(g.idx).buffer),5125,g.idx.length,'SCALAR',34963);meshes.push({name:g.name,primitives:[{attributes:{POSITION:p,NORMAL:n,TEXCOORD_0:uv},indices:idx,material:materialOf(g.name),mode:4}]});nodes.push({name:g.name,mesh:meshes.length-1});}
const all=groups.flatMap(g=>g.p),bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<all.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],all[i+k]);bounds[1][k]=Math.max(bounds[1][k],all[i+k]);}
const gltf={asset:{version:'2.0',generator:'AtelierX standalone shirt topology v4',extras:{atelierxStandalone:{orderId:'ATEL-47',revision:'v4-gray',status:'neutral gray shape candidate for independent QA',geometryOrigin:'New parametric standalone shirt topology authored from the brief; no source or candidate meshes used.',uv:{semantic:'TEXCOORD_0',bodyPanels:'Separate front/back shells use U left-to-right with V=0 shoulder to V=1 hem; vertical stripe mapping remains upright.',sleeves:'Swept sleeve U wraps around circumference and V runs shoulder to cuff.',otherGroups:'Shoulder bridges, integrated collar parts, cuffs, placket and buttons have separate named groups.'},materialGroups:groups.map(g=>g.name),displayBoundsMeters:{min:bounds[0],max:bounds[1]},dimensionsAreDisplayEnvelope:true,notManufacturingSize:true}}},scene:0,scenes:[{name:'ATEL-47 shirt · standalone, no mannequin',nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
const out='orders/ATEL-47/v4/designer/garment-gray-v4.glb';fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});writeGlb(path.join(root,out),{g:gltf,bin});
console.log(JSON.stringify({out,groups:groups.map(g=>g.name),vertices:all.length/3,triangles:groups.reduce((n,g)=>n+g.idx.length/3,0),bounds,dimensionsCm:bounds[0].map((x,i)=>Math.round((bounds[1][i]-x)*1000)/10)},null,2));
