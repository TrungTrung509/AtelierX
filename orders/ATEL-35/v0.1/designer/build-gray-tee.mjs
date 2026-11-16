import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'quality/candidates/user-supplied/t-shirt.glb';
const outputPath = 'orders/ATEL-35/v0.1/designer/garment-v0_1.glb';
const expectedSourceSha = '922001c3404f16be6a5e752928063696469d10c6dd0f269e44b455f41d79e237';
const input = fs.readFileSync(sourcePath);
const sourceSha = crypto.createHash('sha256').update(input).digest('hex');
if (sourceSha !== expectedSourceSha) throw new Error(`Unexpected source SHA: ${sourceSha}`);
const jsonLength = input.readUInt32LE(12);
const gltf = JSON.parse(input.toString('utf8', 20, 20 + jsonLength));
const binHeader = 20 + jsonLength;
const bin = Buffer.from(input.subarray(binHeader + 8, binHeader + 8 + input.readUInt32LE(binHeader)));
if (gltf.meshes.length !== 1 || gltf.meshes[0].primitives.length !== 1) throw new Error('Expected one garment mesh/primitive');
const primitive = gltf.meshes[0].primitives[0];
const uvAccessorId = primitive.attributes.TEXCOORD_0;
if (uvAccessorId === undefined) throw new Error('Source has no TEXCOORD_0');
const uv = gltf.accessors[uvAccessorId];
if (uv.type !== 'VEC2') throw new Error('Unexpected UV accessor type');

// The two Sketchfab wrapper rotations cancel to identity (verified from node
// matrices). Source bounds are approximately 76 source units tall, interpreted
// as centimeters. Bake scale 0.01, bottom to y=0, and center x/z.
const positionAccessor = gltf.accessors[primitive.attributes.POSITION];
const positionView = gltf.bufferViews[positionAccessor.bufferView];
const positionStart = (positionView.byteOffset || 0) + (positionAccessor.byteOffset || 0);
const positionStride = positionView.byteStride || 12;
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positionAccessor.count; i++) {
  const offset = positionStart + i * positionStride;
  for (let k = 0; k < 3; k++) {
    const x = bin.readFloatLE(offset + 4 * k);
    min[k] = Math.min(min[k], x); max[k] = Math.max(max[k], x);
  }
}
const scale = 0.01;
const translation = [-(min[0] + max[0]) * scale / 2, -min[1] * scale, -(min[2] + max[2]) * scale / 2];
min = [Infinity, Infinity, Infinity]; max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < positionAccessor.count; i++) {
  const offset = positionStart + i * positionStride;
  const p = [0, 1, 2].map(k => bin.readFloatLE(offset + 4 * k) * scale + translation[k]);
  for (let k = 0; k < 3; k++) { bin.writeFloatLE(p[k], offset + 4 * k); min[k] = Math.min(min[k], p[k]); max[k] = Math.max(max[k], p[k]); }
}
positionAccessor.min = min; positionAccessor.max = max;

// Remove only the redundant source wrapper nodes. Geometry stays as a single
// original mesh with UV0 and panel topology preserved.
gltf.nodes = [{ name: 'ATEL-35 independent gray tee', mesh: 0 }];
gltf.scenes = [{ name: 'ATEL-35 standalone garment', nodes: [0] }];
gltf.scene = 0;
const mat = gltf.materials[primitive.material];
mat.pbrMetallicRoughness = { ...mat.pbrMetallicRoughness, baseColorFactor: [0.34, 0.36, 0.38, 1], metallicFactor: 0, roughnessFactor: 0.88 };
delete mat.pbrMetallicRoughness.baseColorTexture;
delete mat.normalTexture; delete mat.occlusionTexture; delete mat.emissiveTexture;
gltf.asset.extras = {
  ...(gltf.asset.extras || {}),
  atelierxStandalone: {
    order: 'ATEL-35', revision: 'v0.1-gray', sourcePath, sourceSha256: sourceSha,
    sourceAuthor: 'Hyperrealitystudio', sourceLicense: 'CC-BY-4.0',
    sourceUrl: 'https://sketchfab.com/3d-models/t-shirt-7c8a4dede482474fa5a74f24c6fc5e81',
    transform: 'wrapper rotations cancel to identity; source cm -> meters (0.01); garment bottom y=0; x/z centered; no mannequin',
    appearance: 'neutral gray baseColorFactor; source color/normal/emissive textures detached for shape review',
    uv: { semantic: 'TEXCOORD_0', accessor: uvAccessorId, count: uv.count, min: uv.min, max: uv.max },
    status: 'shape review only; not approved, not published',
  },
};

const pad = (b, value) => b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - b.length % 4, value)]) : b;
const jsonChunk = pad(Buffer.from(JSON.stringify(gltf)), 0x20);
const binChunk = pad(bin, 0);
const header = Buffer.alloc(12); header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jh = Buffer.alloc(8); jh.writeUInt32LE(jsonChunk.length); jh.write('JSON', 4);
const bh = Buffer.alloc(8); bh.writeUInt32LE(binChunk.length); bh.write('BIN\0', 4);
const output = Buffer.concat([header, jh, jsonChunk, bh, binChunk]);
fs.mkdirSync('orders/ATEL-35/v0.1/designer', { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({ outputPath, sourceSha256: sourceSha, outputSha256: crypto.createHash('sha256').update(output).digest('hex'), outputBytes: output.length, boundsMeters: { min, max }, scale, translation, uv0: { accessor: uvAccessorId, count: uv.count, min: uv.min, max: uv.max }, meshCount: gltf.meshes.length, primitiveCount: gltf.meshes[0].primitives.length, texturesDetached: true }, null, 2));
