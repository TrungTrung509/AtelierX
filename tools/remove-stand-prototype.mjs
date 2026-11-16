#!/usr/bin/env node
// Diagnostic prototype for the Grab3D candidate. Never promotes a base by itself.
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'quality/candidates/grab3d-hoodie.glb';
const output = process.argv[3] || 'quality/candidates/grab3d-hoodie-clean-prototype.glb';
const bytes = fs.readFileSync(input);
if (bytes.toString('utf8', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2) throw new Error('GLB v2 required');
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
const binHeader = 20 + jsonLength;
const binLength = bytes.readUInt32LE(binHeader);
const bin = bytes.subarray(binHeader + 8, binHeader + 8 + binLength);
const primitive = gltf.meshes[0].primitives[0];

function accessor(id) {
  const a = gltf.accessors[id], view = gltf.bufferViews[a.bufferView];
  const width = {SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4}[a.type];
  const size = {5121: 1, 5123: 2, 5125: 4, 5126: 4}[a.componentType];
  const stride = view.byteStride || width * size;
  const offset = (view.byteOffset || 0) + (a.byteOffset || 0);
  const read = {5121: i => bin.readUInt8(i), 5123: i => bin.readUInt16LE(i), 5125: i => bin.readUInt32LE(i), 5126: i => bin.readFloatLE(i)}[a.componentType];
  return {count: a.count, componentType: a.componentType, get: (i, k = 0) => read(offset + i * stride + k * size)};
}

const positions = accessor(primitive.attributes.POSITION);
const indices = accessor(primitive.indices);
const kept = [];
let removed = 0;
for (let i = 0; i < indices.count; i += 3) {
  const tri = [indices.get(i), indices.get(i + 1), indices.get(i + 2)];
  const ys = tri.map(v => positions.get(v, 1));
  const zs = tri.map(v => positions.get(v, 2));
  // The stand is centred at z≈0 and continues above/below the hoodie.
  // Hoodie fabric begins at z≈0.04. This is only a spatial prototype;
  // browser QA must inspect for missing garment faces and remaining stand parts.
  if (Math.min(...ys) < 0.62 || Math.max(...ys) > 1.43 || Math.min(...zs) < 0.035) {
    removed++;
  } else {
    kept.push(...tri);
  }
}
if (kept.length < 6000 || removed < 50) throw new Error('Unexpected geometry selection');

const componentSize = indices.componentType === 5125 ? 4 : 2;
const extra = Buffer.alloc(kept.length * componentSize);
kept.forEach((value, i) => componentSize === 4 ? extra.writeUInt32LE(value, i * 4) : extra.writeUInt16LE(value, i * 2));
const offset = (bin.length + 3) & ~3;
const nextBin = Buffer.concat([bin, Buffer.alloc(offset - bin.length), extra]);
const viewId = gltf.bufferViews.length;
gltf.bufferViews.push({buffer: 0, byteOffset: offset, byteLength: extra.length, target: 34963});
const accessorId = gltf.accessors.length;
gltf.accessors.push({bufferView: viewId, byteOffset: 0, componentType: indices.componentType, count: kept.length, type: 'SCALAR'});
primitive.indices = accessorId;
gltf.buffers[0].byteLength = nextBin.length;

const nextJson = Buffer.from(JSON.stringify(gltf));
const jsonPad = Buffer.alloc((4 - nextJson.length % 4) % 4, 0x20);
const binPad = Buffer.alloc((4 - nextBin.length % 4) % 4);
const total = 12 + 8 + nextJson.length + jsonPad.length + 8 + nextBin.length + binPad.length;
const header = Buffer.alloc(12);
header.write('glTF', 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(total, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(nextJson.length + jsonPad.length, 0); jsonHeader.write('JSON', 4);
const dataHeader = Buffer.alloc(8);
dataHeader.writeUInt32LE(nextBin.length + binPad.length, 0); dataHeader.write('BIN\0', 4);
fs.mkdirSync(path.dirname(output), {recursive: true});
fs.writeFileSync(output, Buffer.concat([header, jsonHeader, nextJson, jsonPad, dataHeader, nextBin, binPad]));
console.log(JSON.stringify({input, output, trianglesBefore: indices.count / 3, trianglesKept: kept.length / 3, trianglesRemoved: removed}, null, 2));
