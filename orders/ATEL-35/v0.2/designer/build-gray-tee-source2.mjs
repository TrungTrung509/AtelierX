import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath='quality/candidates/user-supplied/t-shirt (1).glb';
const outputPath='orders/ATEL-35/v0.2/designer/garment-v0_2.glb';
const expectedSourceSha='4edb5292c2a5003dba5200af62ce6cd45f3a4ca1dadbaa94ad8c8553d3e8f241';
const bytes=fs.readFileSync(sourcePath),sourceSha=crypto.createHash('sha256').update(bytes).digest('hex');
if(sourceSha!==expectedSourceSha)throw new Error(`Source hash mismatch: ${sourceSha}`);
const jl=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.toString('utf8',20,20+jl)),jo=20+jl;
const bin=Buffer.from(bytes.subarray(jo+8,jo+8+bytes.readUInt32LE(jo)));
if(gltf.meshes.length!==1||gltf.meshes[0].primitives.length!==1)throw new Error('Expected a single mesh and primitive');
const primitive=gltf.meshes[0].primitives[0],uvId=primitive.attributes.TEXCOORD_0;
if(uvId===undefined)throw new Error('Source has no UV0');
const pos=gltf.accessors[primitive.attributes.POSITION],posView=gltf.bufferViews[pos.bufferView];
const uv=gltf.accessors[uvId];
const posStart=(posView.byteOffset||0)+(pos.byteOffset||0),posStride=posView.byteStride||12;
let rawMin=[Infinity,Infinity,Infinity],rawMax=[-Infinity,-Infinity,-Infinity];
for(let i=0;i<pos.count;i++)for(let k=0;k<3;k++){const x=bin.readFloatLE(posStart+i*posStride+4*k);rawMin[k]=Math.min(rawMin[k],x);rawMax[k]=Math.max(rawMax[k],x)}

// Source wrapper matrix is a uniform 1.370895 scale plus +90° X rotation:
// source (x,y,z) -> (x,z,-y). Source coordinates are millimeter-like; apply
// root scale and 0.001 m conversion, bake both, center x/z, and put hem at y=0.
const rootScale=1.3708950281143188,unitScale=0.001,effectiveScale=rootScale*unitScale;
const rawWorldMin=[rawMin[0]*rootScale,rawMin[2]*rootScale,-rawMax[1]*rootScale];
const rawWorldMax=[rawMax[0]*rootScale,rawMax[2]*rootScale,-rawMin[1]*rootScale];
const translation=[-(rawWorldMin[0]+rawWorldMax[0])*unitScale/2,-rawWorldMin[1]*unitScale,-(rawWorldMin[2]+rawWorldMax[2])*unitScale/2];
let min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
for(let i=0;i<pos.count;i++){
  const o=posStart+i*posStride,x=bin.readFloatLE(o),y=bin.readFloatLE(o+4),z=bin.readFloatLE(o+8);
  const p=[x*effectiveScale+translation[0],z*effectiveScale+translation[1],-y*effectiveScale+translation[2]];
  p.forEach((v,k)=>{bin.writeFloatLE(v,o+4*k);min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v)});
}
pos.min=min;pos.max=max;
const transformVectors=(semantic,dim,normalize=false)=>{
  const id=primitive.attributes[semantic];if(id===undefined)return;
  const a=gltf.accessors[id],v=gltf.bufferViews[a.bufferView],start=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||dim*4;
  if(a.componentType!==5126)throw new Error(`Unsupported ${semantic} component type`);
  let vmin=Array(dim).fill(Infinity),vmax=Array(dim).fill(-Infinity);
  for(let i=0;i<a.count;i++){
    const o=start+i*stride,old=[0,1,2].map(k=>bin.readFloatLE(o+4*k));
    let xyz=[old[0],old[2],-old[1]];
    if(normalize){const len=Math.hypot(...xyz)||1;xyz=xyz.map(x=>x/len)}
    xyz.forEach((x,k)=>{bin.writeFloatLE(x,o+4*k);vmin[k]=Math.min(vmin[k],x);vmax[k]=Math.max(vmax[k],x)});
    if(dim===4){const w=bin.readFloatLE(o+12);vmin[3]=Math.min(vmin[3],w);vmax[3]=Math.max(vmax[3],w)}
  }
  if(a.min){a.min=vmin;a.max=vmax;}
};
transformVectors('NORMAL',3,true);transformVectors('TANGENT',4,true);

// Flatten source root hierarchy after baking its transform into the garment.
gltf.nodes=[{name:'ATEL-35 standalone tee v0.2 gray',mesh:0}];
gltf.scenes=[{name:'ATEL-35 standalone source2 garment',nodes:[0]}];gltf.scene=0;
const mat=gltf.materials[primitive.material];
mat.pbrMetallicRoughness={...(mat.pbrMetallicRoughness||{}),baseColorFactor:[0.34,0.36,0.38,1],metallicFactor:0,roughnessFactor:0.88};
delete mat.pbrMetallicRoughness.baseColorTexture;delete mat.pbrMetallicRoughness.metallicRoughnessTexture;
delete mat.normalTexture;delete mat.occlusionTexture;delete mat.emissiveTexture;
gltf.asset.extras={...(gltf.asset.extras||{}),atelierxStandalone:{order:'ATEL-35',revision:'v0.2-gray',sourcePath,sourceSha256:sourceSha,sourceAuthor:'Sirenko',sourceLicense:'CC-BY-4.0',sourceUrl:'https://sketchfab.com/3d-models/t-shirt-00daf5abf6d44db9a310b8264ad0e834',transform:'source matrix baked: (x,y,z)->(x,z,-y), root scale 1.370895, source mm assumption to meters 0.001, x/z centered, hem at y=0',uv:{semantic:'TEXCOORD_0',accessor:uvId,count:uv.count,min:uv.min,max:uv.max},status:'shape review only; not approved, not published'}};
const pad=(b,v)=>b.length%4?Buffer.concat([b,Buffer.alloc(4-b.length%4,v)]):b,j=pad(Buffer.from(JSON.stringify(gltf)),0x20),bb=pad(bin,0),h=Buffer.alloc(12);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+j.length+8+bb.length,8);const jh=Buffer.alloc(8),bh=Buffer.alloc(8);jh.writeUInt32LE(j.length);jh.write('JSON',4);bh.writeUInt32LE(bb.length);bh.write('BIN\0',4);const out=Buffer.concat([h,jh,j,bh,bb]);
fs.mkdirSync('orders/ATEL-35/v0.2/designer',{recursive:true});fs.writeFileSync(outputPath,out);
console.log(JSON.stringify({outputPath,sourceSha256:sourceSha,outputSha256:crypto.createHash('sha256').update(out).digest('hex'),positionCount:pos.count,rawBounds: {min:rawMin,max:rawMax},normalizedBoundsMeters:{min,max},transform:{rootScale,unitScale,effectiveScale,translation},uv0:{accessor:uvId,count:uv.count,min:uv.min,max:uv.max},meshCount:gltf.meshes.length,primitiveCount:primitive?1:0,grayBaseColor:[0.34,0.36,0.38,1]},null,2));
