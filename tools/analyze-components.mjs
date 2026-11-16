import fs from 'node:fs';
const bytes = fs.readFileSync(process.argv[2]);
if (bytes.toString('utf8',0,4)!=='glTF') throw new Error('GLB required');
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.toString('utf8',20,20+jsonLength));
const binStart = 20+jsonLength+8;
const primitive = gltf.meshes[0].primitives[0];
function accessor(id) {
  const a=gltf.accessors[id], v=gltf.bufferViews[a.bufferView];
  const n={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type];
  const size={5121:1,5123:2,5125:4,5126:4}[a.componentType];
  const stride=v.byteStride||n*size;
  const offset=binStart+(v.byteOffset||0)+(a.byteOffset||0);
  const read={5121:i=>bytes.readUInt8(i),5123:i=>bytes.readUInt16LE(i),5125:i=>bytes.readUInt32LE(i),5126:i=>bytes.readFloatLE(i)}[a.componentType];
  return {count:a.count,get:(i,k=0)=>read(offset+i*stride+k*size)};
}
const pos=accessor(primitive.attributes.POSITION), uv=accessor(primitive.attributes.TEXCOORD_0), idx=accessor(primitive.indices);
const parent=Uint32Array.from({length:pos.count},(_,i)=>i);
function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x]}return x}
function join(a,b){a=find(a);b=find(b);if(a!==b)parent[b]=a}
for(let i=0;i<idx.count;i+=3){const a=idx.get(i),b=idx.get(i+1),c=idx.get(i+2);join(a,b);join(a,c)}
const components=new Map();
for(let i=0;i<idx.count;i+=3){const root=find(idx.get(i));let c=components.get(root);if(!c){c={faces:0,min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity],uvMin:[Infinity,Infinity],uvMax:[-Infinity,-Infinity]};components.set(root,c)}c.faces++;for(let j=0;j<3;j++){const vert=idx.get(i+j);for(let k=0;k<3;k++){const value=pos.get(vert,k);c.min[k]=Math.min(c.min[k],value);c.max[k]=Math.max(c.max[k],value)}for(let k=0;k<2;k++){const value=uv.get(vert,k);c.uvMin[k]=Math.min(c.uvMin[k],value);c.uvMax[k]=Math.max(c.uvMax[k],value)}}}
const ranked=[...components].sort((a,b)=>b[1].faces-a[1].faces);
console.log(JSON.stringify({vertexCount:pos.count,triangleCount:idx.count/3,componentCount:components.size,largest:ranked.slice(0,30).map(([root,c])=>({root,...c})),outsideGarment:ranked.filter(([,c])=>c.min[1]<0.6 || c.max[1]>1.5).slice(0,30).map(([root,c])=>({root,...c}))},null,2));
