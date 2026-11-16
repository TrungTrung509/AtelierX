import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'quality/candidates/user-supplied/tshirt.glb';
const expectedSourceSha = 'c21ef90d256b1f28177e8468cc9f69a83dbdd0cc4111addc23f9893e82a1103a';
const outputPath = 'orders/ATEL-35/v0.5/designer/garment-v0_5.glb';
const targetDisplayHeightMeters = 0.68;
const source = fs.readFileSync(sourcePath);
if (source.toString('utf8', 0, 4) !== 'glTF') throw new Error('Source is not a GLB');
const sourceSha = crypto.createHash('sha256').update(source).digest('hex');
if (sourceSha !== expectedSourceSha) throw new Error(`Source SHA-256 mismatch: ${sourceSha}`);
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
const jsonEnd = 20 + jsonLength;
const binLength = source.readUInt32LE(jsonEnd);
const bin = Buffer.from(source.subarray(jsonEnd + 8, jsonEnd + 8 + binLength));

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const multiply = (a, b) => {
  const out = Array(16).fill(0);
  for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++) for (let k = 0; k < 4; k++) {
    out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
  }
  return out;
};
const nodeMatrix = node => {
  if (node.matrix) return node.matrix;
  const [x, y, z, w] = node.rotation ?? [0, 0, 0, 1];
  const [sx, sy, sz] = node.scale ?? [1, 1, 1];
  const [tx, ty, tz] = node.translation ?? [0, 0, 0];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [
    (1 - yy - zz) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - xx - zz) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - xx - yy) * sz, 0,
    tx, ty, tz, 1,
  ];
};
const worldMatrices = [];
const includeMesh = (meshIndex, matrix, bounds) => {
  const mesh = gltf.meshes[meshIndex];
  for (const primitive of mesh.primitives ?? []) {
    const positionIndex = primitive.attributes?.POSITION;
    const uvIndex = primitive.attributes?.TEXCOORD_0;
    if (positionIndex === undefined || uvIndex === undefined) throw new Error(`Mesh ${mesh.name} is missing POSITION or UV0`);
    const pos = gltf.accessors[positionIndex];
    const posView = gltf.bufferViews[pos.bufferView];
    const posStart = (posView.byteOffset ?? 0) + (pos.byteOffset ?? 0);
    const posStride = posView.byteStride ?? 12;
    for (let i = 0; i < pos.count; i++) {
      const x = bin.readFloatLE(posStart + i * posStride);
      const y = bin.readFloatLE(posStart + i * posStride + 4);
      const z = bin.readFloatLE(posStart + i * posStride + 8);
      const p = [
        matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
        matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
        matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
      ];
      p.forEach((value, axis) => { bounds.min[axis] = Math.min(bounds.min[axis], value); bounds.max[axis] = Math.max(bounds.max[axis], value); });
    }
  }
};
const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] };
const visit = (index, parentMatrix) => {
  const matrix = multiply(parentMatrix, nodeMatrix(gltf.nodes[index]));
  worldMatrices[index] = matrix;
  if (gltf.nodes[index].mesh !== undefined) includeMesh(gltf.nodes[index].mesh, matrix, bounds);
  for (const child of gltf.nodes[index].children ?? []) visit(child, matrix);
};
const sceneIndex = gltf.scene ?? 0;
const sceneRoots = [...(gltf.scenes?.[sceneIndex]?.nodes ?? [])];
if (!sceneRoots.length) throw new Error('Source has no scene roots');
for (const root of sceneRoots) visit(root, identity());
const sourceSize = bounds.max.map((value, axis) => value - bounds.min[axis]);
const displayScale = targetDisplayHeightMeters / sourceSize[1];
const displayTranslation = [
  -(bounds.min[0] + bounds.max[0]) * displayScale / 2,
  -bounds.min[1] * displayScale,
  -(bounds.min[2] + bounds.max[2]) * displayScale / 2,
];
const displayRootIndex = gltf.nodes.length;
gltf.nodes.push({
  name: 'ATEL-35 v0.5 display normalization (source coordinates to meters)',
  children: sceneRoots,
  translation: displayTranslation,
  scale: [displayScale, displayScale, displayScale],
});
gltf.scenes[sceneIndex].nodes = [displayRootIndex];

for (const material of gltf.materials ?? []) {
  material.pbrMetallicRoughness ??= {};
  const pbr = material.pbrMetallicRoughness;
  delete pbr.baseColorTexture;
  delete pbr.metallicRoughnessTexture;
  delete material.normalTexture;
  delete material.occlusionTexture;
  pbr.baseColorFactor = [0.26, 0.27, 0.28, 1];
  pbr.metallicFactor = 0;
  pbr.roughnessFactor = 0.92;
  material.emissiveFactor = [0, 0, 0];
}
const uvSummary = [];
for (const [meshIndex, mesh] of gltf.meshes.entries()) for (const [primitiveIndex, primitive] of mesh.primitives.entries()) {
  const uvIndex = primitive.attributes.TEXCOORD_0;
  const uv = gltf.accessors[uvIndex];
  const view = gltf.bufferViews[uv.bufferView];
  const start = (view.byteOffset ?? 0) + (uv.byteOffset ?? 0);
  const stride = view.byteStride ?? 8;
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  for (let i = 0; i < uv.count; i++) for (let axis = 0; axis < 2; axis++) {
    const value = bin.readFloatLE(start + i * stride + axis * 4);
    min[axis] = Math.min(min[axis], value); max[axis] = Math.max(max[axis], value);
  }
  uv.min = min; uv.max = max;
  uvSummary.push({ meshIndex, meshName: mesh.name, primitiveIndex, accessor: uvIndex, count: uv.count, min, max });
}
gltf.asset.extras = {
  ...(gltf.asset.extras ?? {}),
  atelierxStandalone: {
    order: 'ATEL-35',
    revision: 'v0.5-gray',
    status: 'gray shape-review candidate; not approved or published',
    derivedFrom: {
      path: sourcePath,
      sha256: sourceSha,
      registryId: 'user-tshirt-c21ef90d-v1',
      license: 'owner-authorized-project-use',
      policy: 'quality/USER_SUPPLIED_BASE_POLICY.md',
      originalAttribution: gltf.asset.extras,
    },
    method: 'Preserve source mesh geometry, transforms, normals and UV0; apply one uniform meter/display-scale parent with the hem at y=0 and the body centered; remove color-image bindings and assign neutral gray PBR. No garment geometry was added or removed.',
    sourceBoundsBeforeNormalization: { min: bounds.min, max: bounds.max, size: sourceSize },
    displayNormalization: {
      targetHeightMeters: targetDisplayHeightMeters,
      uniformScale: displayScale,
      translationMeters: displayTranslation,
      isManufacturingSize: false,
    },
    folds: 'Source has no normal or base-color textures; visible folds in gray are geometry and supplied vertex normals.',
    uv0: uvSummary,
  },
};

const pad = (buffer, byte) => buffer.length % 4 ? Buffer.concat([buffer, Buffer.alloc(4 - buffer.length % 4, byte)]) : buffer;
const jsonChunk = pad(Buffer.from(JSON.stringify(gltf)), 0x20);
const binChunk = pad(bin, 0);
const header = Buffer.alloc(12);
header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonChunk.length); jsonHeader.write('JSON', 4);
const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binChunk.length); binHeader.write('BIN\0', 4);
const output = Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);
fs.mkdirSync('orders/ATEL-35/v0.5/designer', { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({
  sourcePath, sourceSha256: sourceSha, outputPath,
  outputSha256: crypto.createHash('sha256').update(output).digest('hex'),
  meshCount: gltf.meshes.length,
  primitiveCount: uvSummary.length,
  displayScale,
  displayTranslation,
  sourceBoundsBeforeNormalization: bounds,
  normalizedHeightMeters: sourceSize[1] * displayScale,
  uv0: uvSummary,
}, null, 2));
