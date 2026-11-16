import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'quality/candidates/makehuman-tshirt.glb';
const outputPath = 'orders/ATEL-35/v0.3/designer/garment-v0_3.glb';
const source = fs.readFileSync(sourcePath);
if (source.toString('utf8', 0, 4) !== 'glTF') throw new Error('Source is not a GLB');
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
const jsonChunkEnd = 20 + jsonLength;
const binLength = source.readUInt32LE(jsonChunkEnd);
const bin = Buffer.from(source.subarray(jsonChunkEnd + 8, jsonChunkEnd + 8 + binLength));
const meshes = gltf.meshes ?? [];
if (meshes.length !== 1 || meshes[0].primitives?.length !== 1) throw new Error('Expected the single MakeHuman shirt mesh');
const primitive = meshes[0].primitives[0];
const uvAccessor = primitive.attributes?.TEXCOORD_0;
if (uvAccessor === undefined) throw new Error('Source has no UV0');
const uv = gltf.accessors[uvAccessor];
const uvView = gltf.bufferViews[uv.bufferView];
const uvStart = (uvView.byteOffset ?? 0) + (uv.byteOffset ?? 0);
const uvStride = uvView.byteStride ?? 8;
const uvMin = [Infinity, Infinity];
const uvMax = [-Infinity, -Infinity];
for (let i = 0; i < uv.count; i++) for (let axis = 0; axis < 2; axis++) {
  const value = bin.readFloatLE(uvStart + i * uvStride + axis * 4);
  uvMin[axis] = Math.min(uvMin[axis], value);
  uvMax[axis] = Math.max(uvMax[axis], value);
}
uv.min = uvMin;
uv.max = uvMax;

const sourceSha256 = crypto.createHash('sha256').update(source).digest('hex');
for (const material of gltf.materials ?? []) {
  material.pbrMetallicRoughness ??= {};
  const pbr = material.pbrMetallicRoughness;
  delete pbr.baseColorTexture;
  delete pbr.metallicRoughnessTexture;
  delete material.normalTexture;
  delete material.occlusionTexture;
  delete material.emissiveTexture;
  material.pbrMetallicRoughness = {
    ...pbr,
    baseColorFactor: [0.38, 0.39, 0.40, 1],
    metallicFactor: 0,
    roughnessFactor: 0.92,
  };
  material.emissiveFactor = [0, 0, 0];
}
gltf.asset.extras = {
  ...(gltf.asset.extras ?? {}),
  atelierxStandalone: {
    order: 'ATEL-35',
    revision: 'v0.3-gray',
    status: 'untextured shape-review candidate; not approved or published',
    derivedFrom: {
      path: sourcePath,
      sha256: sourceSha256,
      asset: 'MakeHuman Cloth_tshirt',
      provenance: 'existing AtelierX quality candidate; MakeHuman asset register identifies CC0 / makehuman_system / MakeHuman Community',
    },
    method: 'preserve shirt surface and topology; remove source imagery/textures from material bindings; assign neutral gray PBR; retain source transforms and UV0',
    uv: {
      semantic: 'TEXCOORD_0',
      accessor: uvAccessor,
      count: gltf.accessors[uvAccessor].count,
      min: uvMin,
      max: uvMax,
    },
  },
};

const pad = (buffer, byte) => buffer.length % 4 ? Buffer.concat([buffer, Buffer.alloc(4 - buffer.length % 4, byte)]) : buffer;
const jsonChunk = pad(Buffer.from(JSON.stringify(gltf)), 0x20);
const binChunk = pad(bin, 0);
const header = Buffer.alloc(12);
header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonChunk.length); jsonHeader.write('JSON', 4);
const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binChunk.length); binHeader.write('BIN\0', 4);
const result = Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);
fs.mkdirSync('orders/ATEL-35/v0.3/designer', { recursive: true });
fs.writeFileSync(outputPath, result);
console.log(JSON.stringify({
  sourcePath,
  sourceSha256,
  outputPath,
  outputSha256: crypto.createHash('sha256').update(result).digest('hex'),
  meshCount: meshes.length,
  primitiveCount: primitive ? 1 : 0,
  attributeSemantics: Object.keys(primitive.attributes),
  positionCount: gltf.accessors[primitive.attributes.POSITION].count,
  triangleCount: gltf.accessors[primitive.indices].count / 3,
  uv0: { accessor: uvAccessor, count: uv.count, min: uvMin, max: uvMax },
  materials: gltf.materials.map(({ name, pbrMetallicRoughness }) => ({ name, pbrMetallicRoughness })),
}, null, 2));
