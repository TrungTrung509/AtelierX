import {readGlb,writeGlb,accessor,primitives} from './showcase-glb.mjs';

const input='orders/ATEL-41/v3/material/garment-surface-v3.glb';
const output='showcase/products/ATEL-41/v4/assets/display.glb';
const doc=readGlb(input);
if(doc.g.meshes?.length!==1||doc.g.meshes[0].primitives.length!==1)throw Error('Expected authored cargo mesh');
const p=doc.g.meshes[0].primitives[0],a=doc.g.accessors[p.attributes.POSITION],view=doc.g.bufferViews[a.bufferView];
if(a.componentType!==5126||a.type!=='VEC3'||a.count<100000)throw Error('Unexpected cargo POSITION accessor');
const bin=Buffer.from(doc.bin),stride=view.byteStride||12,offset=(view.byteOffset||0)+(a.byteOffset||0);
let changed=0,min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
for(let i=0;i<a.count;i++){
 const at=offset+i*stride,x=bin.readFloatLE(at),y=bin.readFloatLE(at+4),z=bin.readFloatLE(at+8);
 let nx=x,ny=y;
 if(y>.75){
   const t=Math.min(1,(y-.75)/.12);
   // Ease the narrow chimney into a continuous, wearable waistband.
   const ease=t*t*(3-2*t);
   nx=x*(1+0.40*ease);
   // Shorten the exaggerated high-rise tube into a visible waistband.
   ny=.75+(y-.75)*.24;
   changed++;
 }
 bin.writeFloatLE(nx,at);bin.writeFloatLE(ny,at+4);
 for(const [k,v] of [nx,ny,z].entries()){min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v)}
}
doc.bin=bin;a.min=min;a.max=max;
const part=primitives(doc)[0],keep=[];let removedTop=0,removedHems=0;
for(let i=0;i<part.indices.length;i+=3){
 const tri=part.indices.slice(i,i+3),[v0,v1,v2]=tri.map(id=>part.points[id]);
 const u=v1.map((v,k)=>v-v0[k]),v=v2.map((x,k)=>x-v0[k]);
 const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const horizontal=Math.abs(cross[1])/Math.max(Math.hypot(...cross),1e-12)>.91;
 const y=(v0[1]+v1[1]+v2[1])/3;
 if(horizontal&&y>.772){removedTop++;continue}
 if(horizontal&&y<.032){removedHems++;continue}
 keep.push(...tri);
}
if(removedTop<1500||removedHems<1000)throw Error(`Cap removal unexpectedly small: ${removedTop}/${removedHems}`);
const idx=Buffer.alloc(keep.length*4);keep.forEach((id,i)=>idx.writeUInt32LE(id,i*4));
const idxOffset=(doc.bin.length+3)&~3;doc.bin=Buffer.concat([doc.bin,Buffer.alloc(idxOffset-doc.bin.length),idx]);
const idxView=doc.g.bufferViews.push({buffer:0,byteOffset:idxOffset,byteLength:idx.length,target:34963})-1;
p.indices=doc.g.accessors.push({bufferView:idxView,componentType:5125,count:keep.length,type:'SCALAR',min:[0],max:[a.count-1]})-1;
const shell=doc.g.materials[p.material];shell.doubleSided=true;
doc.g.extras={...(doc.g.extras||{}),atelierxRepair:'Reduced exaggerated high-rise waistband and widened waist-to-hip transition; removed horizontal fill triangles at waistband and both leg hems so shell stays open'};
writeGlb(output,doc);
console.log(JSON.stringify({output,changedVertices:changed,removedTop,removedHems,bounds:{min,max},triangles:primitives(doc)[0].indices.length/3}));
