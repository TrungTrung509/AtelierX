import fs from 'node:fs';
import crypto from 'node:crypto';
const garmentPath = 'orders/ATEL-23/internal-form-assessment/japanese-school-shirt.glb';
const mannequinPath = 'quality/candidates/mannequin/mannequin-180cm-v1.glb';
const outputPath = 'showcase/quality-preview/atel23-japanese-shirt-assessment/assets/fit.glb';
function read(path) { const b=fs.readFileSync(path), jl=b.readUInt32LE(12), g=JSON.parse(b.toString('utf8',20,20+jl)), jo=20+jl, bl=b.readUInt32LE(jo); return {g,bin:Buffer.from(b.subarray(jo+8,jo+8+bl)),sha:crypto.createHash('sha256').update(b).digest('hex')}; }
const c=read(garmentPath), m=read(mannequinPath), align4=n=>(n+3)&~3;
const merged=structuredClone(c.g), mg=structuredClone(m.g), offset=align4(c.bin.length);
const n={accessors:merged.accessors.length,views:merged.bufferViews.length,meshes:merged.meshes.length,nodes:merged.nodes.length,materials:merged.materials.length,images:(merged.images||[]).length,textures:(merged.textures||[]).length,samplers:(merged.samplers||[]).length};
for(const v of mg.bufferViews||[])v.byteOffset=(v.byteOffset||0)+offset;
for(const a of mg.accessors||[])if(a.bufferView!==undefined)a.bufferView+=n.views;
for(const mesh of mg.meshes||[])for(const p of mesh.primitives){for(const k of Object.keys(p.attributes))p.attributes[k]+=n.accessors;if(p.indices!==undefined)p.indices+=n.accessors;if(p.material!==undefined)p.material+=n.materials;}
for(const node of mg.nodes||[]){if(node.mesh!==undefined)node.mesh+=n.meshes;if(node.children)node.children=node.children.map(i=>i+n.nodes);}
for(const scene of mg.scenes||[])scene.nodes=scene.nodes.map(i=>i+n.nodes);
for(const image of mg.images||[])if(image.bufferView!==undefined)image.bufferView+=n.views;
for(const texture of mg.textures||[]){if(texture.source!==undefined)texture.source+=n.images;if(texture.sampler!==undefined)texture.sampler+=n.samplers;}
for(const mat of mg.materials||[]){for(const key of ['normalTexture','occlusionTexture','emissiveTexture'])if(mat[key]?.index!==undefined)mat[key].index+=n.textures;for(const key of ['baseColorTexture','metallicRoughnessTexture'])if(mat.pbrMetallicRoughness?.[key]?.index!==undefined)mat.pbrMetallicRoughness[key].index+=n.textures;}
merged.accessors.push(...(mg.accessors||[]));merged.bufferViews.push(...(mg.bufferViews||[]));merged.meshes.push(...(mg.meshes||[]));merged.nodes.push(...(mg.nodes||[]));merged.materials.push(...(mg.materials||[]));merged.images=[...(merged.images||[]),...(mg.images||[])];merged.textures=[...(merged.textures||[]),...(mg.textures||[])];merged.samplers=[...(merged.samplers||[]),...(mg.samplers||[])];merged.scenes[merged.scene||0].nodes.push(...mg.scenes[mg.scene||0].nodes);merged.buffers[0].byteLength=offset+m.bin.length;
const binary=Buffer.alloc(offset+m.bin.length);c.bin.copy(binary);m.bin.copy(binary,offset);
const pad=(b,v)=>b.length%4?Buffer.concat([b,Buffer.alloc(4-b.length%4,v)]):b, jb=pad(Buffer.from(JSON.stringify(merged)),0x20),bb=pad(binary,0),h=Buffer.alloc(12);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jb.length+8+bb.length,8);const jh=Buffer.alloc(8),bh=Buffer.alloc(8);jh.writeUInt32LE(jb.length);jh.write('JSON',4);bh.writeUInt32LE(bb.length);bh.write('BIN\0',4);
const out=Buffer.concat([h,jh,jb,bh,bb]);fs.mkdirSync('showcase/quality-preview/atel23-japanese-shirt-assessment/assets',{recursive:true});fs.writeFileSync(outputPath,out);
console.log(JSON.stringify({outputPath,garmentSha256:c.sha,mannequinSha256:m.sha,combinedSha256:crypto.createHash('sha256').update(out).digest('hex'),garmentMeshes:c.g.meshes.length,mannequinMeshes:m.g.meshes.length},null,2));
