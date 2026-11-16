import fs from 'node:fs';
import crypto from 'node:crypto';

const sourcePath = 'quality/candidates/user-supplied/japanese_school_uniform.glb';
const outputPath = 'orders/ATEL-23/internal-form-assessment/japanese-school-shirt.glb';
const source = fs.readFileSync(sourcePath);
const sourceSha256 = crypto.createHash('sha256').update(source).digest('hex');
const jsonLength = source.readUInt32LE(12);
const json = JSON.parse(source.toString('utf8', 20, 20 + jsonLength));
const binHeader = 20 + jsonLength;
const binLength = source.readUInt32LE(binHeader);
const binStart = binHeader + 8;
const bin = Buffer.from(source.subarray(binStart, binStart + binLength));

// Source root matrix maps source (x,y,z) to (x,z,-y). Source coordinates are
// centimeters: whole outfit is ~75 cm tall and shirt width ~64 cm. Bake the
// transform and cm->m scale into vertices so the result is world-meter +Y-up,
// +Z-front without carrying the source's nested root transform.
const scale = 0.01;
const mapPosition = ([x, y, z]) => [x * scale, z * scale, -y * scale];
const mapDirection = ([x, y, z]) => [x, z, -y];
const keptSourceMeshes = [1, 2, 3]; // shirt body shells + collar/cuffs; exclude bow and skirt.
const keptSourceNodes = keptSourceMeshes.map(meshIndex => meshIndex + 2);
const componentTypeSize = { 5126: 4 };
const dimensions = { VEC3: 3, VEC4: 4 };
const updates = [];

for (const meshIndex of keptSourceMeshes) {
  const mesh = json.meshes[meshIndex];
  if (!mesh || mesh.primitives.length !== 1) throw new Error(`Expected one primitive in source mesh ${meshIndex}`);
  const primitive = mesh.primitives[0];
  for (const semantic of ['POSITION', 'NORMAL', 'TANGENT']) {
    const accessorIndex = primitive.attributes[semantic];
    if (accessorIndex === undefined) continue;
    const accessor = json.accessors[accessorIndex];
    const view = json.bufferViews[accessor.bufferView];
    const size = componentTypeSize[accessor.componentType];
    const dim = dimensions[accessor.type];
    if (size !== 4 || !dim || accessor.componentType !== 5126) throw new Error(`Unsupported ${semantic} accessor on mesh ${meshIndex}`);
    const stride = view.byteStride || size * dim;
    const start = (view.byteOffset || 0) + (accessor.byteOffset || 0);
    const values = [];
    for (let i = 0; i < accessor.count; i++) {
      const offset = start + i * stride;
      const input = Array.from({ length: dim }, (_, k) => bin.readFloatLE(offset + k * size));
      const output = semantic === 'POSITION' ? mapPosition(input) : mapDirection(input);
      for (let k = 0; k < 3; k++) bin.writeFloatLE(output[k], offset + k * size);
      values.push(output);
    }
    if (semantic === 'POSITION' || semantic === 'NORMAL') {
      const mins = [0, 1, 2].map(k => Math.min(...values.map(v => v[k])));
      const maxs = [0, 1, 2].map(k => Math.max(...values.map(v => v[k])));
      accessor.min = mins;
      accessor.max = maxs;
    }
    updates.push({ meshIndex, semantic, count: accessor.count });
  }
}

const selectedMeshes = keptSourceMeshes.map(i => json.meshes[i]);
const selectedNodes = keptSourceNodes.map((sourceNodeIndex, i) => ({
  name: `japanese-shirt-part-${i + 1}-from-node-${sourceNodeIndex}`,
  mesh: i,
}));
json.meshes = selectedMeshes;
json.nodes = selectedNodes;
json.scenes = [{ name: 'Japanese uniform shirt-only extraction (normalized)', nodes: selectedNodes.map((_, i) => i) }];
json.scene = 0;
json.asset.extras = {
  ...(json.asset.extras || {}),
  atelierxAssessment: {
    revision: 'ATEL-23/internal-form-assessment/japanese-shirt-01',
    sourcePath,
    sourceSha256,
    license: 'CC-BY-4.0; user-supplied internal asset',
    selectedSourceMeshIndices: keptSourceMeshes,
    excludedSourceMeshIndices: [0, 4, 5, 6],
    units: 'source centimeters scaled by 0.01 into meters',
    axesBaked: 'source x,y,z -> mannequin x,z,-y; +Y up, +Z front',
    geometrySemantic: 'candidate shirt body/collar/cuffs only; no bow or skirt; exploratory fit, not approved',
  },
};

const pad = (b, value) => b.length % 4 ? Buffer.concat([b, Buffer.alloc(4 - b.length % 4, value)]) : b;
const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 0x20);
const binChunk = pad(bin, 0);
const header = Buffer.alloc(12); header.write('glTF'); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const jh = Buffer.alloc(8); jh.writeUInt32LE(jsonChunk.length); jh.write('JSON', 4);
const bh = Buffer.alloc(8); bh.writeUInt32LE(binChunk.length); bh.write('BIN\0', 4);
const output = Buffer.concat([header, jh, jsonChunk, bh, binChunk]);
fs.mkdirSync('orders/ATEL-23/internal-form-assessment', { recursive: true });
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({ outputPath, sourceSha256, outputSha256: crypto.createHash('sha256').update(output).digest('hex'), outputBytes: output.length, keptSourceMeshes, units: 'cm to m (0.01)', axes: 'source x,y,z -> x,z,-y', parts: selectedNodes.map(n => n.name), updates }, null, 2));
