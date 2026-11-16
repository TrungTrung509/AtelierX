import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'quality/candidates/user-supplied/t-shirt___lp.glb';
const expectedSourceSha = '7158e4b64cdc94df03a3ac14cf72df8a6716bdd2650dd0472df87e4cbf27c3c3';
const outputPath = 'orders/ATEL-35/v0.4/designer/garment-v0_4.glb';
const source = fs.readFileSync(sourcePath);
if (source.toString('utf8', 0, 4) !== 'glTF') throw new Error('Source is not a GLB');
const sourceSha = crypto.createHash('sha256').update(source).digest('hex');
if (sourceSha !== expectedSourceSha) throw new Error(`Source SHA-256 mismatch: ${sourceSha}`);
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
const jsonEnd = 20 + jsonLength;
const binLength = source.readUInt32LE(jsonEnd);
const bin = Buffer.from(source.subarray(jsonEnd + 8, jsonEnd + 8 + binLength));
const meshInfo = [];
for (const [meshIndex, mesh] of (gltf.meshes ?? []).entries()) {
  for (const [primitiveIndex, primitive] of (mesh.primitives ?? []).entries()) {
    const uvIndex = primitive.attributes?.TEXCOORD_0;
    if (uvIndex === undefined) throw new Error(`Mesh ${meshIndex}/${primitiveIndex} has no UV0`);
    const uv = gltf.accessors[uvIndex];
    const view = gltf.bufferViews[uv.bufferView];
    const start = (view.byteOffset ?? 0) + (uv.byteOffset ?? 0);
    const stride = view.byteStride ?? 8;
    const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
    for (let i = 0; i < uv.count; i++) for (let axis = 0; axis < 2; axis++) {
      const value = bin.readFloatLE(start + i * stride + axis * 4);
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
    uv.min = min; uv.max = max;
    meshInfo.push({
      meshIndex,
      meshName: mesh.name,
      primitiveIndex,
      uvAccessor: uvIndex,
      uvCount: uv.count,
      uvMin: min,
      uvMax: max,
      positionCount: gltf.accessors[primitive.attributes.POSITION].count,
      indexCount: gltf.accessors[primitive.indices]?.count ?? null,
      materialIndex: primitive.material,
    });
  }
}
if (!meshInfo.length) throw new Error('No garment primitives found');

// The source coordinates and its published y bounds are centimeter-like
// (approximately 98.5–167 cm in the shirt's original scene). Apply one uniform
// parent scale to express the same form in meters without editing vertices.
const rootIndex = gltf.scenes?.[gltf.scene ?? 0]?.nodes?.[0];
if (rootIndex === undefined) throw new Error('Source has no scene root');
const scaledRootIndex = gltf.nodes.length;
gltf.nodes.push({ name: 'ATEL-35 v0.4 source centimeters to meters', children: [rootIndex], scale: [0.01, 0.01, 0.01] });
gltf.scenes[gltf.scene ?? 0].nodes = [scaledRootIndex];

const materialSummary = [];
for (const material of gltf.materials ?? []) {
  material.pbrMetallicRoughness ??= {};
  const pbr = material.pbrMetallicRoughness;
  const retainedNormalMap = Boolean(material.normalTexture);
  const retainedOcclusionMap = Boolean(material.occlusionTexture);
  delete pbr.baseColorTexture;
  delete pbr.metallicRoughnessTexture;
  pbr.baseColorFactor = [0.26, 0.27, 0.28, 1];
  pbr.metallicFactor = 0;
  pbr.roughnessFactor = 0.92;
  material.emissiveFactor = [0, 0, 0];
  materialSummary.push({ name: material.name, retainedNormalMap, retainedOcclusionMap });
}
gltf.asset.extras = {
  ...(gltf.asset.extras ?? {}),
  atelierxStandalone: {
    order: 'ATEL-35',
    revision: 'v0.4-gray',
    status: 'untextured color / retained normal detail for shape review only; not approved or published',
    derivedFrom: {
      path: sourcePath,
      sha256: sourceSha,
      registryId: 'user-t-shirt-lp-7158e4b6-v1',
      license: 'owner-authorized-project-use',
      licensePolicy: 'quality/USER_SUPPLIED_BASE_POLICY.md',
    },
    method: 'Preserve source meshes, transforms, UV0, normal maps and occlusion maps; add one uniform 0.01 parent scale to convert centimeter-like scene coordinates to meters; remove base-color and metallic-roughness image bindings; assign neutral gray PBR. No garment geometry was added or removed.',
    sourceUnitAssumption: 'centimeter-like coordinates, inferred from the original garment bounds; uniform scale 0.01 to meters',
    folds: 'Source preview shows raised folds; this gray derivative retains the source normal map, so fine fold detail may be shader/texture-derived rather than geometric relief.',
    uv0: meshInfo,
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
fs.mkdirSync('orders/ATEL-35/v0.4/designer', { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({
  sourcePath,
  sourceSha256: sourceSha,
  outputPath,
  outputSha256: crypto.createHash('sha256').update(output).digest('hex'),
  meshCount: gltf.meshes.length,
  primitiveCount: meshInfo.length,
  materials: materialSummary,
  unitScale: 0.01,
  meshInfo,
}, null, 2));
