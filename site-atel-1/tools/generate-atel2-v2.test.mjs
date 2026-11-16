import assert from 'node:assert/strict';
import test from 'node:test';
import zlib from 'node:zlib';
import { buildModel, createArtworkSvg, createManifest } from './generate-atel2-v2.mjs';

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
  assert.equal(document.materials[front.primitives[0].material].pbrMetallicRoughness.baseColorTexture, undefined, 'front has no artwork texture');
  assert.ok(front.primitives[0].indices !== undefined && back.primitives[0].indices !== undefined);
  const uvAccessor = document.accessors[back.primitives[0].attributes.TEXCOORD_0];
  const uvView = document.bufferViews[uvAccessor.bufferView];
  const firstV = binary.readFloatLE(uvView.byteOffset + 4);
  const lastRowVOffset = uvView.byteOffset + (uvAccessor.count - 33) * 8 + 4;
  const lastV = binary.readFloatLE(lastRowVOffset);
  assert.equal(firstV, 1, 'bottom of garment uses bottom of texture');
  assert.equal(lastV, 0, 'top of garment uses top of texture');
});

function decodeRgbaPng(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  let width = 0;
  let height = 0;
  const compressed = [];
  for (let offset = 8; offset < buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); }
    if (type === 'IDAT') compressed.push(data);
    offset += 12 + length;
  }
  const raw = zlib.inflateSync(Buffer.concat(compressed));
  const stride = width * 4;
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const sourceOffset = y * (stride + 1);
    assert.equal(raw[sourceOffset], 0, 'generator uses PNG filter 0 for artwork texture');
    raw.copy(pixels, y * stride, sourceOffset + 1, sourceOffset + 1 + stride);
  }
  return { width, height, pixels };
}

test('artwork has exactly one open eye socket, centered and fully inside the texture', () => {
  const { texture } = buildModel();
  const { width, height, pixels } = decodeRgbaPng(texture);
  const pixel = (x, y) => pixels[(y * width + x) * 4];
  const centerEyeRow = 160 + 147;
  let darkRuns = 0;
  let insideDarkRun = false;
  for (let x = 460; x <= 564; x += 1) {
    const isDark = pixel(x, centerEyeRow) < 90;
    if (isDark && !insideDarkRun) darkRuns += 1;
    insideDarkRun = isDark;
  }
  assert.equal(darkRuns, 1, 'one connected dark eye cavity; no paired eye openings');
  assert.ok(pixel(512, centerEyeRow) < 90, 'single eye socket is open and prominent');
  assert.ok(pixel(439, centerEyeRow) > 100, 'left eye position is solid bone, not another open socket');
  assert.ok(pixel(585, centerEyeRow) > 100, 'the opposite eye position is solid bone, not another open socket');

  let minX = width; let minY = height; let maxX = -1; let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixel(x, y) > 100) {
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
    }
  }
  assert.ok(minX > 100 && maxX < width - 100 && minY > 100 && maxY < height - 100, 'print has safe margins and is not clipped');
  assert.ok(Math.abs((minX + maxX) / 2 - width / 2) <= 2, 'print is horizontally centered');
  const artwork = createArtworkSvg();
  assert.ok(artwork.includes('data-revision="v2"'), 'SVG explicitly identifies revision v2');
  assert.equal(artwork.match(/<ellipse\b/g)?.length, 2, 'one eye has only a rim and one open socket');
  const manifest = createManifest();
  assert.equal(manifest.revision, 'v2');
  assert.equal(manifest.sourceRevision, 'v1');
  assert.equal(manifest.model, 'hoodie-skull-v2.glb');
  assert.equal(manifest.texture, 'hoodie-back-skull-texture-v2.png');
  assert.equal(manifest.artwork, 'hoodie-back-skull-artwork-v2.svg');
  assert.equal(manifest.runtimeBrowserQA.startsWith('Not confirmed'), true);
  assert.equal(manifest.physicalFitQA.startsWith('Not confirmed'), true);
});
