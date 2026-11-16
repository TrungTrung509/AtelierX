import fs from 'node:fs';

export function readGlb(file) {
  const b=fs.readFileSync(file);
  if(b.toString('ascii',0,4)!=='glTF'||b.readUInt32LE(4)!==2) throw Error('Expected GLB 2');
  const n=b.readUInt32LE(12), g=JSON.parse(b.toString('utf8',20,20+n));
  if(g.skins?.length||g.animations?.length||g.extensionsRequired?.length) throw Error('Use an uncompressed static GLB export');
  const bin=b.subarray(28+n,28+n+b.readUInt32LE(20+n));
  if(g.buffers?.length!==1||g.buffers[0].uri||g.images?.some(i=>i.uri)) throw Error('Embed all buffers and images in GLB');
  return {g,bin};
}
export function writeGlb(file,{g,bin}) {
  const pad=(b,c=0)=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4,c)]);
  g.buffers=[{byteLength:bin.length}];
  const j=pad(Buffer.from(JSON.stringify(g)),32),b=pad(bin),h=Buffer.alloc(12),jh=Buffer.alloc(8),bh=Buffer.alloc(8);
  h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(28+j.length+b.length,8);
  jh.writeUInt32LE(j.length);jh.write('JSON',4);bh.writeUInt32LE(b.length);bh.write('BIN\0',4);
  fs.writeFileSync(file,Buffer.concat([h,jh,j,bh,b]));
}
export function accessor(doc,id) {
  const a=doc.g.accessors[id],v=doc.g.bufferViews[a.bufferView];
  if(a.sparse)throw Error('Sparse accessor unsupported; export dense geometry');
  const sizes={5121:1,5123:2,5125:4,5126:4},reads={5121:'readUInt8',5123:'readUInt16LE',5125:'readUInt32LE',5126:'readFloatLE'},n={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],size=sizes[a.componentType];
  if(!size||!n)throw Error('Unsupported accessor');
  return Array.from({length:a.count},(_,i)=>Array.from({length:n},(_,k)=>doc.bin[reads[a.componentType]]((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||n*size)+k*size)));
}
const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function multiply(a,b){return Array.from({length:16},(_,i)=>{const row=i%4,col=Math.floor(i/4);return [0,1,2,3].reduce((s,k)=>s+a[k*4+row]*b[col*4+k],0)})}
export function primitives(doc) {
  const out=[];
  function visit(id,parent){const n=doc.g.nodes[id];let m=n.matrix;
    if(!m){const [x,y,z,w]=n.rotation||[0,0,0,1],s=n.scale||[1,1,1],t=n.translation||[0,0,0];m=[(1-2*y*y-2*z*z)*s[0],(2*x*y+2*z*w)*s[0],(2*x*z-2*y*w)*s[0],0,(2*x*y-2*z*w)*s[1],(1-2*x*x-2*z*z)*s[1],(2*y*z+2*x*w)*s[1],0,(2*x*z+2*y*w)*s[2],(2*y*z-2*x*w)*s[2],(1-2*x*x-2*y*y)*s[2],0,...t,1]}
    const world=multiply(parent,m);
    if(n.mesh!==undefined)for(const p of doc.g.meshes[n.mesh].primitives){if(p.mode!==undefined&&p.mode!==4)throw Error('Triangle geometry required');
      const points=accessor(doc,p.attributes.POSITION).map(v=>[0,1,2].map(k=>world[k]*v[0]+world[4+k]*v[1]+world[8+k]*v[2]+world[12+k]));
      const indices=p.indices===undefined?points.map((_,i)=>i):accessor(doc,p.indices).flat();out.push({p,points,indices});}
    for(const child of n.children||[])visit(child,world);
  }
  for(const id of doc.g.scenes[doc.g.scene||0].nodes)visit(id,identity());return out;
}
export function mergeGlb(a,b) {
  const g=structuredClone(a.g),c=b.g,off=(a.bin.length+3)&~3,bin=Buffer.concat([a.bin,Buffer.alloc(off-a.bin.length),b.bin]);
  const keys=['bufferViews','accessors','meshes','nodes','materials','textures','images','samplers','cameras'],o={};
  for(const k of keys){g[k]||=[];o[k]=g[k].length}
  const bump=(v,k)=>v===undefined?undefined:v+o[k];
  g.bufferViews.push(...(c.bufferViews||[]).map(v=>({...v,buffer:0,byteOffset:off+(v.byteOffset||0)})));
  g.accessors.push(...(c.accessors||[]).map(v=>({...v,bufferView:bump(v.bufferView,'bufferViews')})));
  g.images.push(...(c.images||[]).map(v=>({...v,bufferView:bump(v.bufferView,'bufferViews')})));
  g.samplers.push(...(c.samplers||[]));
  g.textures.push(...(c.textures||[]).map(v=>({...v,source:bump(v.source,'images'),sampler:bump(v.sampler,'samplers')})));
  function remap(v){if(!v||typeof v!=='object')return v;if(Array.isArray(v))return v.map(remap);return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,k==='index'&&typeof x==='number'?x+o.textures:remap(x)]))}
  g.materials.push(...(c.materials||[]).map(remap));
  g.meshes.push(...(c.meshes||[]).map(m=>({...m,primitives:m.primitives.map(p=>({...p,attributes:Object.fromEntries(Object.entries(p.attributes).map(([k,v])=>[k,v+o.accessors])),indices:bump(p.indices,'accessors'),material:bump(p.material,'materials'),targets:p.targets?.map(t=>Object.fromEntries(Object.entries(t).map(([k,v])=>[k,v+o.accessors])))}))})));
  g.cameras.push(...(c.cameras||[]));
  g.nodes.push(...(c.nodes||[]).map(n=>({...n,mesh:bump(n.mesh,'meshes'),camera:bump(n.camera,'cameras'),children:n.children?.map(i=>i+o.nodes)})));
  g.scenes[g.scene||0].nodes.push(...c.scenes[c.scene||0].nodes.map(i=>i+o.nodes));
  g.extensionsUsed=[...new Set([...(g.extensionsUsed||[]),...(c.extensionsUsed||[])])];
  return {g,bin};
}

// Remove only mannequin triangles fully enclosed by garment front/back at all
// three vertices, away from neck, cuffs and hem. The original GLB stays intact.
export function maskCoveredBody(body,garment,{minY,maxY,maxAbsX}) {
  const cell=.025,grid=new Map(),key=(x,y)=>`${x},${y}`;
  for(const {points,indices} of primitives(garment))for(let i=0;i<indices.length;i+=3){const t=indices.slice(i,i+3).map(j=>points[j]);
    const xs=t.map(p=>p[0]),ys=t.map(p=>p[1]);
    for(let x=Math.floor(Math.min(...xs)/cell);x<=Math.floor(Math.max(...xs)/cell);x++)for(let y=Math.floor(Math.min(...ys)/cell);y<=Math.floor(Math.max(...ys)/cell);y++){const k=key(x,y);if(!grid.has(k))grid.set(k,[]);grid.get(k).push(t)}
  }
  function covered([x,y,z]){
    if(y<minY||y>maxY||Math.abs(x)>maxAbsX)return false;
    const hits=[];for(const [a,b,c] of grid.get(key(Math.floor(x/cell),Math.floor(y/cell)))||[]){
      const d=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(d)<1e-10)continue;
      const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/d,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/d;
      if(u>=0&&v>=0&&u+v<=1)hits.push(u*a[2]+v*b[2]+(1-u-v)*c[2]);
    }return hits.some(h=>h<z-.003)&&hits.some(h=>h>z+.003);
  }
  let removed=0;for(const {p,points,indices} of primitives(body)){
    const yes=points.map(covered),keep=[];
    for(let i=0;i<indices.length;i+=3){const t=indices.slice(i,i+3);if(t.every(j=>yes[j]))removed++;else keep.push(...t)}
    if(!keep.length){p._empty=true;continue;}
    const bytes=Buffer.alloc(keep.length*4);keep.forEach((v,i)=>bytes.writeUInt32LE(v,i*4));
    const off=(body.bin.length+3)&~3;body.bin=Buffer.concat([body.bin,Buffer.alloc(off-body.bin.length),bytes]);
    const bv=body.g.bufferViews.push({buffer:0,byteOffset:off,byteLength:bytes.length})-1;
    p.indices=body.g.accessors.push({bufferView:bv,componentType:5125,count:keep.length,type:'SCALAR'})-1;
  }
  const remap=new Map();body.g.meshes=body.g.meshes.filter((m,i)=>{m.primitives=m.primitives.filter(p=>!p._empty);if(!m.primitives.length)return false;remap.set(i,remap.size);return true});
  for(const node of body.g.nodes||[])if(node.mesh!==undefined){if(remap.has(node.mesh))node.mesh=remap.get(node.mesh);else delete node.mesh;}
  return removed;
}
