import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeGlb} from '../../../../tools/showcase-glb.mjs';

// Parametric shirt geometry authored from the ATEL-47 brief. No source mesh is
// imported. Separate named groups preserve the requested surface assignments.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const groups=[];
const part=name=>{const g={name,p:[],n:[],uv:[],idx:[]};groups.push(g);return g;};
const vtx=(g,p,n,uv)=>{const len=Math.hypot(...n)||1;g.p.push(...p);g.n.push(...n.map(x=>x/len));g.uv.push(...uv);return g.p.length/3-1;};
const tri=(g,a,b,c)=>g.idx.push(a,b,c);
const grid=(g,rows,cols,point,normal)=>{const ids=[];for(let r=0;r<=rows;r++){ids[r]=[];for(let c=0;c<=cols;c++){const u=c/cols,w=r/rows;ids[r][c]=vtx(g,point(u,w),normal(u,w),[u,1-w]);}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],d=ids[r+1][c],e=ids[r+1][c+1];tri(g,a,d,b);tri(g,b,d,e);}};
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};

// Regular-fit body volume narrows at the waist and shoulders. Front and back
// are independent mapped panels; both use V=0 at shoulder and V=1 at hem.
function profile(y){const t=Math.max(0,Math.min(1,(y-.33)/.64));let width,depth;if(t<.30){width=lerp(.222,.204,smooth(t/.30));depth=lerp(.078,.084,smooth(t/.30));}else if(t<.72){width=lerp(.204,.244,smooth((t-.30)/.42));depth=lerp(.084,.089,smooth((t-.30)/.42));}else if(t<.86){width=lerp(.244,.260,smooth((t-.72)/.14));depth=lerp(.089,.086,smooth((t-.72)/.14));}else{width=lerp(.260,.105,smooth((t-.86)/.14));depth=lerp(.086,.057,smooth((t-.86)/.14));}return {width,depth};}
function topY(u,front=true){return .89+(front?.035:.060)*Math.exp(-(((u-.5)/.27)**2));}
function bodyPoint(front,u,v,offset=0){const y=lerp(.33,topY(u,front),v),{width,depth}=profile(y),x=(u*2-1)*width,across=1-(x/width)**2;const left=Math.exp(-(((u-.16)/.09)**2)),right=Math.exp(-(((u-.84)/.09)**2)),waist=Math.exp(-(((y-.49)/.13)**2));const phase=front?0:1.2;const drape=.0065*left*Math.sin(y*25+u*4+phase)*waist+.0058*right*Math.sin(y*22-u*3+phase)*waist+.0028*Math.sin(y*16+u*5+phase)*Math.exp(-(((y-.44)/.10)**2))+.0018*Math.sin(u*16+phase)*Math.exp(-(((y-.36)/.04)**2));const z=(front?1:-1)*(depth*Math.sqrt(Math.max(0,across))+drape+offset);return [x,y,z];}
function bodyNormal(front,u,w){const e=.001,p0=bodyPoint(front,Math.max(0,u-e),w),p1=bodyPoint(front,Math.min(1,u+e),w),q0=bodyPoint(front,u,Math.max(0,w-e)),q1=bodyPoint(front,u,Math.min(1,w+e)),a=p1.map((x,i)=>x-p0[i]),b=q1.map((x,i)=>x-q0[i]);let n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];if(!front)n=n.map(x=>-x);const l=Math.hypot(...n)||1;return n.map(x=>x/l);}
function bodyAtXY(front,x,y,offset=0){const width=profile(y).width,u=.5+x/(2*width);return bodyPoint(front,u,(y-.33)/(topY(u,front)-.33),offset);}
for(const front of [true,false]){const g=part(front?'Front body panel':'Back body panel');grid(g,72,48,(u,v)=>bodyPoint(front,u,v),(u,v)=>bodyNormal(front,u,v));}

// The collar stand is a narrow contoured band; its front neckline sits lower.
const collarBand=part('Collar stand');
grid(collarBand,8,72,(u,v)=>{const a=u*Math.PI*2,back=(1-Math.cos(a))*.5,base=.913+.016*back,y=base+.018*v;return [(.078+.002)*Math.sin(a),y,(.046+.002)*Math.cos(a)];},u=>[Math.sin(u*Math.PI*2),.14,Math.cos(u*Math.PI*2)]);
// Collar leaves start on the stand/chest surface and taper to softly rounded
// points, so they read as one attached collar rather than floating triangles.
for(const side of [-1,1]){const g=part(side<0?'Collar leaf left':'Collar leaf right');grid(g,32,24,(u,v)=>{const xTop=.020+.050*u,yTop=.914-.020*u,xBottom=.050+.035*u,yBottom=.860-.018*u,x=side*lerp(xTop,xBottom,v),y=lerp(yTop,yBottom,v),p=bodyAtXY(true,x,y,.007),soft=.002*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);return [x,y,p[2]+soft];},()=>[0,.24,1]);}

// Sleeve tubes taper from shoulder to wrist, with restrained low folds.
function sleeveAxis(side,t){return [side*(.16+.15*t),.892-.47*t+.012*Math.sin(Math.PI*t),0];}
function sleeveSurface(side,t,a,extra=0){const [cx,y,cz]=sleeveAxis(side,t),r=.088-.035*t,depth=.072-.026*t,fold=.0025*Math.sin(a*2*Math.PI*4+t*13)+.0011*Math.sin(a*2*Math.PI*3-t*29),ang=a*2*Math.PI;return [cx+side*(r+fold+extra)*Math.cos(ang),y+(r+fold)*Math.sin(ang)*.18,cz+(depth+fold*.65+extra)*Math.sin(ang)];}
for(const side of [-1,1]){const label=side<0?'left':'right',sleeve=part(`Sleeve ${label}`);grid(sleeve,56,64,(u,v)=>sleeveSurface(side,1.18-v*1.18,u),(u)=>[side*Math.cos(u*2*Math.PI),.16,Math.sin(u*2*Math.PI)]);const cuff=part(`Cuff ${label}`);grid(cuff,10,64,(u,v)=>sleeveSurface(side,.86+v*.14,u,.007),(u)=>[side*Math.cos(u*2*Math.PI),.12,Math.sin(u*2*Math.PI)]);}

// Raised front placket follows the curved chest; buttons and cuffs remain
// dedicated groups. Their flat gray review material will be assigned later.
const placket=part('Front placket');
grid(placket,56,8,(u,v)=>{const y=.385+v*.55,x=(u-.5)*.038,p=bodyAtXY(true,x,y,.004);return [x,y,p[2]+.003];},()=>[0,0,1]);
function sphere(g,c,r,rows=10,cols=16){grid(g,rows,cols,(u,v)=>{const a=u*2*Math.PI,b=v*Math.PI;return [c[0]+r*Math.sin(b)*Math.cos(a),c[1]+r*Math.cos(b),c[2]+r*Math.sin(b)*Math.sin(a)];},(u,v)=>{const a=u*2*Math.PI,b=v*Math.PI;return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)];});}
const buttons=part('Front buttons');for(let i=0;i<6;i++){const y=.43+i*.082,p=bodyAtXY(true,0,y,.012);sphere(buttons,[0,y,p[2]+.002],.0065);}
for(const side of [-1,1]){const g=part(`Cuff button ${side<0?'left':'right'}`),p=sleeveSurface(side,.965,.25);sphere(g,[p[0],p[1],p[2]+.005],.006,8,12);}

const groupsToMaterial=name=>{const n=name.toLowerCase();if(n.includes('button'))return 5;if(n.includes('cuff'))return 3;if(n.includes('sleeve'))return 1;if(n.includes('collar'))return 2;if(n.includes('placket'))return 4;return 0;};
const materialNames=['Body front/back panels','Sleeves','Collar','Cuffs','Placket','Buttons'];
const materials=materialNames.map((name,i)=>({name:`Neutral gray ${name}`,doubleSided:true,pbrMetallicRoughness:{baseColorFactor:i===5?[.14,.15,.16,1]:[.27,.28,.29,1],metallicFactor:0,roughnessFactor:i===5?.72:.9}}));
let bin=Buffer.alloc(0);const views=[],accessors=[];
function view(bytes,target){const offset=(bin.length+3)&~3;bin=Buffer.concat([bin,Buffer.alloc(offset-bin.length),bytes]);views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,...(target?{target}:{})});return views.length-1;}
function accessor(bytes,type,count,shape,target){accessors.push({bufferView:view(bytes,target),componentType:type,count,type:shape});return accessors.length-1;}
const meshes=[],nodes=[];
for(const g of groups){const p=accessor(Buffer.from(new Float32Array(g.p).buffer),5126,g.p.length/3,'VEC3',34962),n=accessor(Buffer.from(new Float32Array(g.n).buffer),5126,g.n.length/3,'VEC3',34962),uv=accessor(Buffer.from(new Float32Array(g.uv).buffer),5126,g.uv.length/2,'VEC2',34962),idx=accessor(Buffer.from(new Uint32Array(g.idx).buffer),5125,g.idx.length,'SCALAR',34963);meshes.push({name:g.name,primitives:[{attributes:{POSITION:p,NORMAL:n,TEXCOORD_0:uv},indices:idx,material:groupsToMaterial(g.name),mode:4}]});nodes.push({name:g.name,mesh:meshes.length-1});}
const positions=groups.flatMap(g=>g.p),bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<positions.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],positions[i+k]);bounds[1][k]=Math.max(bounds[1][k],positions[i+k]);}
const gltf={asset:{version:'2.0',generator:'AtelierX standalone garment authoring',extras:{atelierxStandalone:{orderId:'ATEL-47',revision:'v2-gray',status:'neutral gray shape candidate for independent QA',geometryOrigin:'Original parametric shirt geometry authored from the product brief; no source meshes or candidate outfit geometry used.',uv:{semantic:'TEXCOORD_0',bodyPanels:'U spans left-to-right across each separate front/back panel; V=0 at shoulder and V=1 at hem for upright vertical stripes.',sleeves:'U wraps around each sleeve; V=0 at shoulder and V=1 at cuff.',otherGroups:'Collar stand/leaves, cuffs, placket and buttons are independent UV/material groups.'},materialGroups:groups.map(g=>g.name),displayBoundsMeters:{min:bounds[0],max:bounds[1]},dimensionsAreDisplayEnvelope:true,notManufacturingSize:true}}},scene:0,scenes:[{name:'ATEL-47 shirt · standalone, no mannequin',nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
const out='orders/ATEL-47/v2/designer/garment-gray-v2.glb';fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});writeGlb(path.join(root,out),{g:gltf,bin});
console.log(JSON.stringify({out,groups:groups.map(g=>g.name),vertices:positions.length/3,triangles:groups.reduce((s,g)=>s+g.idx.length/3,0),boundsMeters:bounds,dimensionsDisplayCm:bounds[0].map((x,i)=>Math.round((bounds[1][i]-x)*1000)/10)},null,2));
