import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {readGlb,writeGlb,primitives} from '../../../../tools/showcase-glb.mjs';
const input='orders/ATEL-23/v4.3/designer/garment-v4_3.glb',output='orders/ATEL-23/v4.4/designer/garment-v4_4.glb';
const sourceHash=createHash('sha256').update(fs.readFileSync(input)).digest('hex');
const d=readGlb(input),g=d.g,mesh=g.meshes[0];
// Start from v4.2 shirt only; replace its old faint button primitive with the repair.
mesh.primitives=mesh.primitives.filter(p=>p.material===0);
const pos=[],norm=[],uv=[],idx=[];
function addShoulderCap(sign){const xEdge=.32,bulge=.02,y0=1.499,z0=-.045,ry=.072,rz=.082,segments=32,rs=[.25,.5,.75,1];
  const start=pos.length/3;pos.push(sign*(xEdge+bulge),y0,z0);norm.push(sign,0,0);uv.push(.5,.5);
  for(const r of rs)for(let i=0;i<segments;i++){const a=2*Math.PI*i/segments,dy=ry*r*Math.cos(a),dz=rz*r*Math.sin(a);pos.push(sign*(xEdge+bulge*(1-r*r)),y0+dy,z0+dz);let nx=sign,ny=2*bulge*dy/(ry*ry),nz=2*bulge*dz/(rz*rz),l=Math.hypot(nx,ny,nz);norm.push(nx/l,ny/l,nz/l);uv.push(.5+dz/.30,.5+dy/.30)}
  for(let i=0;i<segments;i++)idx.push(start,start+1+i,start+1+(i+1)%segments);
  for(let r=0;r<rs.length-1;r++){const a0=start+1+r*segments,b0=a0+segments;for(let i=0;i<segments;i++){const j=(i+1)%segments;idx.push(a0+i,b0+i,b0+j,a0+i,b0+j,a0+j)}}
}
// Preserve existing shoulder caps; do not duplicate them.
function appendAccessor(values,componentType,type,components){const bytes=Buffer.alloc(values.length*4);values.forEach((v,i)=>componentType===5125?bytes.writeUInt32LE(v,i*4):bytes.writeFloatLE(v,i*4));const off=(d.bin.length+3)&~3;d.bin=Buffer.concat([d.bin,Buffer.alloc(off-d.bin.length),bytes]);const bv=g.bufferViews.push({buffer:0,byteOffset:off,byteLength:bytes.length})-1;return g.accessors.push({bufferView:bv,componentType,count:values.length/components,type})-1;}
const capP=appendAccessor(pos,5126,'VEC3',3),capN=appendAccessor(norm,5126,'VEC3',3),capUV=appendAccessor(uv,5126,'VEC2',2),capI=appendAccessor(idx,5125,'SCALAR',1);
mesh.primitives.push({attributes:{POSITION:capP,NORMAL:capN,TEXCOORD_0:capUV},indices:capI,material:0});
// Sample actual front fabric at each placket row so the strip and buttons sit on it.
const body=primitives(d).find(p=>p.p.material===0);function surfaceZ(x,y){let best=-Infinity;for(let i=0;i<body.indices.length;i+=3){const [a,b,c]=[body.points[body.indices[i]],body.points[body.indices[i+1]],body.points[body.indices[i+2]]];if(y<Math.min(a[1],b[1],c[1])-.0005||y>Math.max(a[1],b[1],c[1])+.0005||x<Math.min(a[0],b[0],c[0])-.0005||x>Math.max(a[0],b[0],c[0])+.0005)continue;const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-10)continue;const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den,w=1-u-v;if(u>=-1e-4&&v>=-1e-4&&w>=-1e-4)best=Math.max(best,u*a[2]+v*b[2]+w*c[2])}if(!Number.isFinite(best))throw Error(`No fabric at ${x}, ${y}`);return best}
// Narrow, pale-blue front placket gives the closure row a clean visual backing.
const stripPos=[],stripNorm=[],stripIdx=[],rows=18,yMin=1.08,yMax=1.53,half=.014;
for(let j=0;j<=rows;j++){const y=yMin+(yMax-yMin)*j/rows;for(const x of [-half,half]){stripPos.push(x,y,surfaceZ(x,y)+.0015);stripNorm.push(0,0,1)}}for(let j=0;j<rows;j++){const a=j*2;stripIdx.push(a,a+1,a+3,a,a+3,a+2)}
const stripMat=g.materials.push({name:'ATEL-23 v4.3 shirt placket',pbrMetallicRoughness:{baseColorFactor:[.70,.86,.91,1],metallicFactor:0,roughnessFactor:.82},doubleSided:true})-1;
const sP=appendAccessor(stripPos,5126,'VEC3',3),sN=appendAccessor(stripNorm,5126,'VEC3',3),sI=appendAccessor(stripIdx,5125,'SCALAR',1);mesh.primitives.push({attributes:{POSITION:sP,NORMAL:sN},indices:sI,material:stripMat});
// Six readable, dark blue buttons (21 mm diameter), seated 1.5 mm above sampled cloth.
const buttonPos=[],buttonNorm=[],buttonIdx=[],segments=20,r=.0105,depth=.0025,buttonYs=[1.49,1.42,1.35,1.28,1.21,1.14];
for(const y of buttonYs){const zc=surfaceZ(0,y)+.0025,base=buttonPos.length/3;for(const zz of [-depth/2,depth/2])for(let i=0;i<segments;i++){const a=2*Math.PI*i/segments;buttonPos.push(r*Math.cos(a),y+r*Math.sin(a),zc+zz);buttonNorm.push(Math.cos(a),Math.sin(a),0)}for(let i=0;i<segments;i++){const j=(i+1)%segments;buttonIdx.push(base+i,base+j,base+segments+j,base+i,base+segments+j,base+segments+i)}const cap=buttonPos.length/3;buttonPos.push(0,y,zc-depth/2,0,y,zc+depth/2);buttonNorm.push(0,0,-1,0,0,1);for(let i=0;i<segments;i++){const j=(i+1)%segments;buttonIdx.push(cap,base+j,base+i,cap+1,base+segments+i,base+segments+j)}}
const buttonMat=g.materials.push({name:'ATEL-23 v4.3 deep-blue shirt buttons',pbrMetallicRoughness:{baseColorFactor:[.035,.25,.34,1],metallicFactor:0,roughnessFactor:.42},doubleSided:true})-1;
const bP=appendAccessor(buttonPos,5126,'VEC3',3),bN=appendAccessor(buttonNorm,5126,'VEC3',3),bI=appendAccessor(buttonIdx,5125,'SCALAR',1);mesh.primitives.push({attributes:{POSITION:bP,NORMAL:bN},indices:bI,material:buttonMat});
g.asset.generator='AtelierX Designer · ATEL-23/v4.4 verified fix';g.asset.extras={order:'ATEL-23',revision:'v4.4',sourceRevision:'ATEL-23/v4.3',sourceGarmentSha256:sourceHash,fitReference:'mannequin-v1',repairScope:['shoulder/underarm gusset caps','front placket/buttons'],shoulderCaps:{centersX:[-.32,.32],centerY:1.499,centerZ:-.045,radii:[.072,.082],bulge:.02,materialSlot:0},buttonRow:{centersY:buttonYs,diameterMeters:.021,surfaceSampled:true,materialSlot:buttonMat},priorTexturesPreserved:true};
writeGlb(output,d);console.log(JSON.stringify({input,sourceHash,output,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex'),primitiveCount:mesh.primitives.length,repairScope:['shoulder/underarm gusset caps','front placket/buttons']}));
