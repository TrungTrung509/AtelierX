import assert from 'node:assert/strict';
import test from 'node:test';
import { buildModel } from './generate-atel2.mjs';

function parseGlb(buffer) {
  assert.equal(buffer.readUInt32LE(0), 0x46546c67, 'GLB magic');
  assert.equal(buffer.readUInt32LE(4), 2, 'GLB version');
  assert.equal(buffer.readUInt32LE(8), buffer.length, 'GLB total byte length');
  const jsonLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), 0x4e4f534a, 'JSON chunk type');
  const document = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString('utf8').trim());
  const binaryHeaderOffset = 20 + jsonLength;
  assert.equal(buffer.readUInt32LE(binaryHeaderOffset + 4), 0x004e4942, 'BIN chunk type');
  const binaryLength = buffer.readUInt32LE(binaryHeaderOffset);
  return { document, binary: buffer.subarray(binaryHeaderOffset + 8, binaryHeaderOffset + 8 + binaryLength) };
}

test('ATEL-2 generator creates a GLB with wearable mesh parts and embedded back texture', () => {
  const { glb, texture } = buildModel();
  const { document } = parseGlb(glb);
  assert.ok(document.meshes.length >= 8, 'torso, sleeves, cuffs, hood, pocket and cords exist');
  assert.ok(document.materials.some((material) => material.name === 'back-panel-black-with-skull-print'));
  assert.ok(document.materials.some((material) => material.name === 'front-kangaroo-pocket-black-fleece'));
  assert.equal(document.images[0].mimeType, 'image/png');
  assert.equal(document.images[0].bufferView >= 0, true, 'PNG texture is embedded in the GLB');
  assert.deepEqual([...texture.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'sidecar texture is PNG');
  assert.ok(document.accessors.some((accessor) => accessor.type === 'VEC3' && accessor.count > 100));
});

test('front torso is unprinted and back torso alone references the artwork material', () => {
  const { glb } = buildModel();
  const { document, binary } = parseGlb(glb);
  const front = document.meshes.find((mesh) => mesh.name === 'front-pullover-torso-plain');
  const back = document.meshes.find((mesh) => mesh.name === 'back-pullover-torso-print-panel');
  assert.ok(front && back);
  assert.equal(front.primitives[0].material, 0);
  assert.equal(back.primitives[0].material, 1);
  assert.ok(front.primitives[0].indices !== undefined && back.primitives[0].indices !== undefined);
  const uvAccessor = document.accessors[back.primitives[0].attributes.TEXCOORD_0];
  const uvView = document.bufferViews[uvAccessor.bufferView];
  const firstV = binary.readFloatLE(uvView.byteOffset + 4);
  const lastRowVOffset = uvView.byteOffset + (uvAccessor.count - 33) * 8 + 4;
  const lastV = binary.readFloatLE(lastRowVOffset);
  assert.equal(firstV, 1, 'bottom of garment uses bottom of texture');
  assert.equal(lastV, 0, 'top of garment uses top of texture');
});
