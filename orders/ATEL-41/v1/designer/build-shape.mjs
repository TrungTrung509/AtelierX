import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readGlb,writeGlb,primitives} from '../../../../tools/showcase-glb.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const src='quality/candidates/user-supplied/jnco_twin_cannon_baggy_jeans.glb';
const out='orders/ATEL-41/v1/designer/garment-gray-v1.glb';
const d=readGlb(path.join(root,src));
const original=primitives(d);
const bounds=[[Infinity,-Infinity],[Infinity,-Infinity],[Infinity,-Infinity]];
for(const p of original)for(const point of p.points)for(let k=0;k<3;k++){
  bounds[k][0]=Math.min(bounds[k][0],point[k]); bounds[k][1]=Math.max(bounds[k][1],point[k]);
}
const [xmin,xmax]=bounds[0], [ymin,ymax]=bounds[1], [zmin,zmax]=bounds[2];
const spanX=xmax-xmin, spanY=ymax-ymin, spanZ=zmax-zmin;

// Strip all source surfaces (including branded textile labels), retaining only
// the supplied silhouette and seams as a neutral shape-review mesh.
for(const m of d.g.materials||[]){
  m.pbrMetallicRoughness={baseColorFactor:[0.38,0.38,0.38,1],metallicFactor:0,roughnessFactor:0.82};
  delete m.normalTexture; delete m.occlusionTexture; delete m.emissiveTexture;
  delete m.emissiveFactor; delete m.extensions; m.doubleSided=true;
}
d.g.textures=[]; d.g.images=[]; d.g.samplers=[];

const verts=[], norms=[], indices=[];
function quad(a,b,c,e){
  const ax=b[0]-a[0], ay=b[1]-a[1], az=b[2]-a[2], bx=c[0]-a[0], by=c[1]-a[1], bz=c[2]-a[2];
  let n=[ay*bz-az*by,az*bx-ax*bz,ax*by-ay*bx]; const l=Math.hypot(...n)||1; n=n.map(x=>x/l);
  const i=verts.length/3; for(const p of [a,b,c,e]){verts.push(...p);norms.push(...n)} indices.push(i,i+1,i+2,i,i+2,i+3);
}
function box(cx,cy,cz,sx,sy,sz){
  const x0=cx-sx/2,x1=cx+sx/2,y0=cy-sy/2,y1=cy+sy/2,z0=cz-sz/2,z1=cz+sz/2;
  quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]); quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0]);
  quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]); quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1]);
  quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]); quad([x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]);
}
function surfaceZ(x,y,front=true){
  const nearby=original.flatMap(p=>p.points).filter(q=>Math.abs(q[0]-x)<spanX*.09&&Math.abs(q[1]-y)<spanY*.07);
  if(!nearby.length) return front?zmax:zmin;
  return front?Math.max(...nearby.map(q=>q[2])):Math.min(...nearby.map(q=>q[2]));
}
function tube(a,b,r,segments=8){
  const axis=b.map((v,i)=>v-a[i]),len=Math.hypot(...axis),u=axis.map(v=>v/len);
  const helper=Math.abs(u[1])<.9?[0,1,0]:[1,0,0],cross=(x,y)=>[x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]];
  let v=cross(u,helper);v=v.map(x=>x/Math.hypot(...v));let w=cross(u,v);
  for(let i=0;i<segments;i++){
    const t0=i*2*Math.PI/segments,t1=(i+1)*2*Math.PI/segments;
    const point=(p,t)=>p.map((x,k)=>x+r*(Math.cos(t)*v[k]+Math.sin(t)*w[k]));
    quad(point(a,t0),point(a,t1),point(b,t1),point(b,t0));
  }
}

// Two large, raised thigh cargo pockets and their flap panels.
const pocketW=spanX*.205,pocketH=spanY*.145,pocketD=spanZ*.055;
const pocketY=ymin+spanY*.64, frontZ=zmax+spanZ*.095;
for(const side of [-1,1]){
  const cx=side*spanX*.235;
  const localFront=surfaceZ(cx,pocketY,true), pocketCenter=localFront+pocketD*.32;
  box(cx,pocketY,pocketCenter,pocketW,pocketH,pocketD);
  box(cx,pocketY+pocketH*.42,pocketCenter+pocketD*.57,pocketW*1.04,pocketH*.19,pocketD*.24);
  // Drawcord toggle/cord at each hem, routed down the front outer leg.
  const hemX=side*spanX*.235, hemY=ymin+spanY*.035, z=surfaceZ(hemX,hemY,true)+spanZ*.012;
  tube([hemX,hemY+spanY*.035,z],[hemX+side*spanX*.015,hemY-spanY*.045,z+spanZ*.01],spanZ*.012);
  box(hemX,hemY+spanY*.055,z,spanZ*.045,spanY*.014,spanZ*.025);
}

// Visible belt loops, button and a raised fly placket for the gray review.
const waistY=ymin+spanY*.955, loopW=spanX*.034, loopH=spanY*.074, loopD=spanZ*.045;
for(const x of [-.22,-.11,0,.11,.22].map(n=>n*spanX)){
  const front=surfaceZ(x,waistY,true),back=surfaceZ(x,waistY,false);
  box(x,waistY,front+loopD*.28,loopW,loopH,loopD);
  box(x,waistY,back-loopD*.28,loopW,loopH,loopD);
}
const flyY=ymin+spanY*.895, flyX=spanX*.018, flyFront=surfaceZ(flyX,flyY,true);
box(flyX,flyY,flyFront+spanZ*.008,spanX*.12,spanY*.19,spanZ*.025);
// Raised button disc, represented as a compact cylinder oriented toward front.
const buttonY=waistY+loopH*.42,buttonZ=surfaceZ(0,buttonY,true)+spanZ*.008;
tube([0,buttonY,buttonZ],[0,buttonY,buttonZ+spanZ*.022],spanZ*.016,12);

const aligned=(n)=>{while(n%4)n++;return n};
function appendFloat(values,type,components){
  const offset=aligned(d.bin.length);d.bin=Buffer.concat([d.bin,Buffer.alloc(offset-d.bin.length),Buffer.from(new Float32Array(values).buffer)]);
  const view=d.g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:values.length*4})-1;
  return d.g.accessors.push({bufferView:view,componentType:5126,count:values.length/components,type})-1;
}
function appendIndices(values){
  const offset=aligned(d.bin.length);d.bin=Buffer.concat([d.bin,Buffer.alloc(offset-d.bin.length),Buffer.from(new Uint32Array(values).buffer)]);
  const view=d.g.bufferViews.push({buffer:0,byteOffset:offset,byteLength:values.length*4})-1;
  return d.g.accessors.push({bufferView:view,componentType:5125,count:values.length,type:'SCALAR'})-1;
}
const pos=appendFloat(verts,'VEC3',3),normal=appendFloat(norms,'VEC3',3),idx=appendIndices(indices);
d.g.meshes.push({name:'AtelierX cargo details gray',primitives:[{attributes:{POSITION:pos,NORMAL:normal},indices:idx,material:0,mode:4}]});
const mesh=d.g.meshes.length-1;
d.g.nodes.push({name:'AtelierX cargo details gray',mesh});d.g.scenes[d.g.scene||0].nodes.push(d.g.nodes.length-1);
fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});
writeGlb(path.join(root,out),d);
console.log(JSON.stringify({source:src,output:out,sourceBounds:bounds,addedVertices:verts.length/3,addedTriangles:indices.length/3,features:['raised thigh cargo pockets + flaps','belt loops front/back','button and fly placket','drawcords at both hems'],sourceHash: (await import('node:crypto')).createHash('sha256').update(fs.readFileSync(path.join(root,src))).digest('hex')},null,2));
