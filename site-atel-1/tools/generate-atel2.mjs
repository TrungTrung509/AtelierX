#!/usr/bin/env node
/**
 * Builds the AtelierX ATEL-2 hoodie MVP as a self-contained glTF binary.
 * The garment is a procedural placeholder form because no approved hoodie
 * base mesh or UV template is present in the project.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(SCRIPT_DIR, '../dist/assets/models/ATEL-2/v1');
const EVIDENCE_DIR = path.resolve(SCRIPT_DIR, '../evidence/ATEL-2/v1');
const SIZE = 1024;
const BLACK = 0;
const BACK_PRINT = 1;
const POCKET = 2;
const CUFF = 3;
const HOOD = 4;
const CORD = 5;

/** @typedef {{positions:number[], normals:number[], uvs:number[], indices:number[], name:string, material:number}} MeshData */

const meshes = [];

function addMesh(mesh) {
  mesh.normals = computeNormals(mesh.positions, mesh.indices);
  meshes.push(mesh);
}

function computeNormals(positions, indices) {
  const normals = new Array(positions.length).fill(0);
  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i] * 3;
    const ib = indices[i + 1] * 3;
    const ic = indices[i + 2] * 3;
    const abx = positions[ib] - positions[ia];
    const aby = positions[ib + 1] - positions[ia + 1];
    const abz = positions[ib + 2] - positions[ia + 2];
    const acx = positions[ic] - positions[ia];
    const acy = positions[ic + 1] - positions[ia + 1];
    const acz = positions[ic + 2] - positions[ia + 2];
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    for (const index of [ia, ib, ic]) {
      normals[index] += nx;
      normals[index + 1] += ny;
      normals[index + 2] += nz;
    }
  }
  for (let i = 0; i < normals.length; i += 3) {
    const length = Math.hypot(normals[i], normals[i + 1], normals[i + 2]) || 1;
    normals[i] /= length;
    normals[i + 1] /= length;
    normals[i + 2] /= length;
  }
  return normals;
}

function gridMesh(name, rows, columns, pointAt, material, uvAt) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      positions.push(...pointAt(row / (rows - 1), column / (columns - 1)));
      uvs.push(...uvAt(row / (rows - 1), column / (columns - 1)));
    }
  }
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = row * columns + column;
      const b = a + 1;
      const c = a + columns;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  return { name, positions, normals: [], uvs, indices, material };
}

const bodyRings = [
  { y: 0.13, width: 0.57, depth: 0.205 },
  { y: 0.25, width: 0.66, depth: 0.235 },
  { y: 0.54, width: 0.68, depth: 0.225 },
  { y: 1.08, width: 0.79, depth: 0.205 },
  { y: 1.50, width: 0.86, depth: 0.165 },
  { y: 1.73, width: 0.72, depth: 0.145 },
];

function interpolateRing(t) {
  const scaled = t * (bodyRings.length - 1);
  const index = Math.min(bodyRings.length - 2, Math.floor(scaled));
  const fraction = scaled - index;
  const a = bodyRings[index];
  const b = bodyRings[index + 1];
  return {
    y: a.y + (b.y - a.y) * fraction,
    width: a.width + (b.width - a.width) * fraction,
    depth: a.depth + (b.depth - a.depth) * fraction,
  };
}

function addTorsoPanel(name, angleStart, angleEnd, material) {
  addMesh(gridMesh(
    name,
    25,
    33,
    (v, u) => {
      const { y, width, depth } = interpolateRing(v);
      const angle = angleStart + (angleEnd - angleStart) * u;
      return [width * Math.sin(angle), y, depth * Math.cos(angle)];
    },
    material,
    (v, u) => [u, material === BACK_PRINT ? 1 - v : v],
  ));
}

function addSleeve(side, cuff = false) {
  const start = cuff ? 0.90 : 0;
  const end = cuff ? 1.12 : 0.91;
  const pointAt = (v, u) => {
    const t = start + (end - start) * v;
    const center = [side * (0.64 + 0.50 * t), 1.59 - 1.08 * t, -0.015 + 0.045 * Math.sin(t * Math.PI)];
    const tangent = [side * 0.42, -0.91, 0.02];
    const tangentLength = Math.hypot(...tangent);
    for (let i = 0; i < 3; i += 1) tangent[i] /= tangentLength;
    const basisA = [-tangent[1], tangent[0], 0];
    const basisALength = Math.hypot(...basisA);
    for (let i = 0; i < 3; i += 1) basisA[i] /= basisALength;
    const basisB = [
      tangent[1] * basisA[2] - tangent[2] * basisA[1],
      tangent[2] * basisA[0] - tangent[0] * basisA[2],
      tangent[0] * basisA[1] - tangent[1] * basisA[0],
    ];
    const radius = (0.294 - 0.135 * t) * (cuff ? 1 : 1 + 0.04 * Math.cos(u * Math.PI * 2));
    const angle = u * Math.PI * 2;
    return [0, 1, 2].map((axis) => center[axis] + radius * (basisA[axis] * Math.cos(angle) + basisB[axis] * Math.sin(angle)));
  };
  addMesh(gridMesh(
    `${side < 0 ? 'left' : 'right'}-${cuff ? 'rib-cuff' : 'sleeve'}`,
    14,
    25,
    pointAt,
    cuff ? CUFF : BLACK,
    (v, u) => [u, v],
  ));
}

function addHood() {
  addMesh(gridMesh(
    'pullover-hood-shell',
    18,
    27,
    (v, u) => {
      const phi = -Math.PI / 2 + Math.PI * u;
      const cap = Math.sqrt(Math.max(0.04, 1 - v * v * 0.80));
      const width = 0.445 * cap;
      const depth = 0.235 * cap;
      return [width * Math.sin(phi), 1.68 + 0.62 * v, -0.06 - depth * Math.cos(phi)];
    },
    HOOD,
    (v, u) => [u, v],
  ));
}

function addPocket() {
  addMesh(gridMesh(
    'front-kangaroo-pocket-plain',
    9,
    17,
    (v, u) => {
      const y = 0.53 + 0.38 * v;
      const edge = Math.abs(u - 0.5) * 2;
      const width = 0.49 - (1 - v) * 0.035;
      const x = (u - 0.5) * 2 * width;
      const ring = interpolateRing(Math.min(1, Math.max(0, (y - 0.13) / (1.73 - 0.13))));
      const z = ring.depth * Math.sqrt(Math.max(0.04, 1 - (x / ring.width) ** 2)) + 0.018 + edge * 0.001;
      return [x, y, z];
    },
    POCKET,
    (v, u) => [u, v],
  ));
}

function addCord(side) {
  const curve = [];
  const start = [side * 0.095, 1.94, 0.11];
  const end = [side * 0.115, 1.35, 0.185];
  for (let i = 0; i <= 16; i += 1) {
    const t = i / 16;
    curve.push([
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t + 0.018 * Math.sin(Math.PI * t),
    ]);
  }
  const positions = [];
  const uvs = [];
  const indices = [];
  const radialSegments = 7;
  for (let i = 0; i < curve.length; i += 1) {
    const p = curve[i];
    const previous = curve[Math.max(0, i - 1)];
    const next = curve[Math.min(curve.length - 1, i + 1)];
    const tangent = [next[0] - previous[0], next[1] - previous[1], next[2] - previous[2]];
    const len = Math.hypot(...tangent) || 1;
    tangent[0] /= len; tangent[1] /= len; tangent[2] /= len;
    let axisA = [-tangent[1], tangent[0], 0];
    const axisLen = Math.hypot(...axisA) || 1;
    axisA = axisA.map((value) => value / axisLen);
    const axisB = [
      tangent[1] * axisA[2] - tangent[2] * axisA[1],
      tangent[2] * axisA[0] - tangent[0] * axisA[2],
      tangent[0] * axisA[1] - tangent[1] * axisA[0],
    ];
    for (let j = 0; j < radialSegments; j += 1) {
      const angle = j / radialSegments * Math.PI * 2;
      const radius = 0.012;
      positions.push(
        p[0] + radius * (axisA[0] * Math.cos(angle) + axisB[0] * Math.sin(angle)),
        p[1] + radius * (axisA[1] * Math.cos(angle) + axisB[1] * Math.sin(angle)),
        p[2] + radius * (axisA[2] * Math.cos(angle) + axisB[2] * Math.sin(angle)),
      );
      uvs.push(j / radialSegments, i / (curve.length - 1));
    }
  }
  for (let i = 0; i < curve.length - 1; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * radialSegments + j;
      const b = i * radialSegments + (j + 1) % radialSegments;
      const c = a + radialSegments;
      const d = b + radialSegments;
      indices.push(a, b, c, b, d, c);
    }
  }
  addMesh({ name: `hood-drawcord-${side < 0 ? 'left' : 'right'}`, positions, normals: [], uvs, indices, material: CORD });
}

function colorBytes(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255];
}

function makeCanvas(width, height, color) {
  const pixels = Buffer.alloc(width * height * 4);
  const rgba = colorBytes(color);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = rgba[0]; pixels[i + 1] = rgba[1]; pixels[i + 2] = rgba[2]; pixels[i + 3] = 255;
  }
  return pixels;
}

function paintPolygon(pixels, points, color) {
  const minX = Math.max(0, Math.floor(Math.min(...points.map((point) => point[0]))));
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(...points.map((point) => point[0]))));
  const minY = Math.max(0, Math.floor(Math.min(...points.map((point) => point[1]))));
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(...points.map((point) => point[1]))));
  const rgba = colorBytes(color);
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i]; const [xj, yj] = points[j];
        const crosses = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi);
        if (crosses) inside = !inside;
      }
      if (inside) setPixel(pixels, x, y, rgba);
    }
  }
}

function setPixel(pixels, x, y, rgba) {
  const index = (Math.floor(y) * SIZE + Math.floor(x)) * 4;
  pixels[index] = rgba[0]; pixels[index + 1] = rgba[1]; pixels[index + 2] = rgba[2]; pixels[index + 3] = 255;
}

function paintEllipse(pixels, cx, cy, rx, ry, color) {
  const rgba = colorBytes(color);
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) setPixel(pixels, x, y, rgba);
    }
  }
}

function paintLine(pixels, x1, y1, x2, y2, color, width = 5) {
  const rgba = colorBytes(color);
  const minX = Math.max(0, Math.floor(Math.min(x1, x2) - width));
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(x1, x2) + width));
  const minY = Math.max(0, Math.floor(Math.min(y1, y2) - width));
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(y1, y2) + width));
  const dx = x2 - x1; const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy || 1;
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSq));
      if (Math.hypot(x - x1 - dx * t, y - y1 - dy * t) <= width / 2) setPixel(pixels, x, y, rgba);
    }
  }
}

function pngChunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([name, data]);
  const crc = crc32(crcInput);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc >>> 0);
  return Buffer.concat([length, name, data, checksum]);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let value = n;
  for (let k = 0; k < 8; k += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function encodePng(pixels, width = SIZE, height = SIZE) {
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) {
    const offset = y * (width * 4 + 1);
    scanlines[offset] = 0;
    pixels.copy(scanlines, offset + 1, y * width * 4, (y + 1) * width * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 6; header[10] = 0; header[11] = 0; header[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', zlib.deflateSync(scanlines, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function createBackTexture() {
  const pixels = makeCanvas(SIZE, SIZE, '#111214');
  let seed = 90210;
  for (let i = 0; i < SIZE * SIZE; i += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const grain = (seed & 7) - 3;
    const index = i * 4;
    pixels[index] = Math.max(0, pixels[index] + grain);
    pixels[index + 1] = Math.max(0, pixels[index + 1] + grain);
    pixels[index + 2] = Math.max(0, pixels[index + 2] + grain);
  }

  const cx = 512;
  const top = 178;
  const bone = '#DDD8CD';
  const shadow = '#A9A69F';
  const cavity = '#38393B';
  const skull = [
    [cx, top], [cx - 76, top + 8], [cx - 133, top + 44], [cx - 162, top + 108],
    [cx - 159, top + 184], [cx - 133, top + 244], [cx - 91, top + 280],
    [cx - 82, top + 339], [cx - 57, top + 361], [cx + 57, top + 361],
    [cx + 82, top + 339], [cx + 91, top + 280], [cx + 133, top + 244],
    [cx + 159, top + 184], [cx + 162, top + 108], [cx + 133, top + 44], [cx + 76, top + 8],
  ];
  paintPolygon(pixels, skull, bone);
  paintPolygon(pixels, [[cx + 30, top + 23], [cx + 112, top + 55], [cx + 143, top + 113], [cx + 140, top + 177], [cx + 116, top + 224], [cx + 76, top + 257], [cx + 60, top + 325], [cx + 18, top + 340]], shadow);
  paintEllipse(pixels, cx - 70, top + 154, 51, 59, cavity);
  paintEllipse(pixels, cx + 70, top + 154, 51, 59, cavity);
  paintPolygon(pixels, [[cx, top + 191], [cx - 24, top + 231], [cx + 1, top + 245], [cx + 25, top + 230]], cavity);
  paintPolygon(pixels, [[cx - 74, top + 256], [cx + 74, top + 256], [cx + 60, top + 328], [cx + 40, top + 346], [cx - 40, top + 346], [cx - 60, top + 328]], bone);
  paintLine(pixels, cx, top + 268, cx, top + 342, cavity, 5);
  for (const x of [-47, -22, 22, 47]) paintLine(pixels, cx + x, top + 277, cx + x, top + 337, cavity, 4);
  paintLine(pixels, cx - 115, top + 52, cx - 83, top + 93, shadow, 8);
  paintLine(pixels, cx - 83, top + 93, cx - 102, top + 121, shadow, 7);
  paintLine(pixels, cx + 102, top + 70, cx + 77, top + 105, bone, 7);
  paintLine(pixels, cx + 77, top + 105, cx + 88, top + 130, bone, 5);
  paintLine(pixels, cx - 10, top + 5, cx - 25, top + 50, shadow, 6);
  paintLine(pixels, cx - 25, top + 50, cx - 6, top + 72, shadow, 5);
  return encodePng(pixels);
}

function createArtworkSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="440" viewBox="0 0 400 440"><rect width="400" height="440" fill="none"/><g stroke-linejoin="round"><path fill="#ddd8cd" d="M200 20 127 29 72 64 42 129 45 205 69 265 111 300 120 359 145 381h110l25-22 9-59 42-35 24-60-3-76-30-65-55-35z"/><path fill="#a9a69f" d="m230 43 82 32 31 58-3 64-24 47-40 33-16 68-42 15z"/><ellipse cx="130" cy="174" rx="51" ry="59" fill="#38393b"/><ellipse cx="270" cy="174" rx="51" ry="59" fill="#38393b"/><path fill="#38393b" d="m200 211-24 40 25 14 25-15z"/><path fill="#ddd8cd" d="M126 276h148l-14 72-20 18h-80l-20-18z"/><g stroke="#38393b" stroke-width="5"><path d="M200 288v74m-47-65v59m25-62v68m44-68v68m25-65v59"/><path d="m85 72 32 41-19 28m200-57-25 35 11 25M190 22l-15 45 19 22" fill="none" stroke="#a9a69f"/></g></g></svg>`;
}

function align4(buffer) {
  const padding = (4 - buffer.length % 4) % 4;
  return padding ? Buffer.concat([buffer, Buffer.alloc(padding)]) : buffer;
}

function buildGlb(texturePng) {
  const binaryParts = [];
  const bufferViews = [];
  const accessors = [];
  let byteOffset = 0;
  const addBufferView = (buffer, target) => {
    const aligned = align4(buffer);
    const view = { buffer: 0, byteOffset, byteLength: buffer.length };
    if (target) view.target = target;
    bufferViews.push(view);
    binaryParts.push(aligned);
    byteOffset += aligned.length;
    return bufferViews.length - 1;
  };
  const addAccessor = (view, componentType, count, type, min, max) => {
    const accessor = { bufferView: view, componentType, count, type };
    if (min) accessor.min = min;
    if (max) accessor.max = max;
    accessors.push(accessor);
    return accessors.length - 1;
  };
  const primitives = [];
  const gltfMeshes = [];

  for (const mesh of meshes) {
    const positions = Buffer.from(new Float32Array(mesh.positions).buffer);
    const normals = Buffer.from(new Float32Array(mesh.normals).buffer);
    const maxIndex = Math.max(...mesh.indices);
    const indexData = maxIndex < 65536 ? Buffer.from(new Uint16Array(mesh.indices).buffer) : Buffer.from(new Uint32Array(mesh.indices).buffer);
    const positionValues = mesh.positions;
    const min = [0, 1, 2].map((axis) => Math.min(...positionValues.filter((_, i) => i % 3 === axis)));
    const max = [0, 1, 2].map((axis) => Math.max(...positionValues.filter((_, i) => i % 3 === axis)));
    const positionAccessor = addAccessor(addBufferView(positions, 34962), 5126, mesh.positions.length / 3, 'VEC3', min, max);
    const normalAccessor = addAccessor(addBufferView(normals, 34962), 5126, mesh.normals.length / 3, 'VEC3');
    const indexAccessor = addAccessor(addBufferView(indexData, 34963), maxIndex < 65536 ? 5123 : 5125, mesh.indices.length, 'SCALAR', [0], [maxIndex]);
    const attributes = { POSITION: positionAccessor, NORMAL: normalAccessor };
    if (mesh.material === BACK_PRINT) {
      const uvs = Buffer.from(new Float32Array(mesh.uvs).buffer);
      attributes.TEXCOORD_0 = addAccessor(addBufferView(uvs, 34962), 5126, mesh.uvs.length / 2, 'VEC2');
    }
    gltfMeshes.push({ name: mesh.name, primitives: [{ attributes, indices: indexAccessor, material: mesh.material, mode: 4 }] });
  }

  const imageView = addBufferView(texturePng, undefined);
  const totalBinary = Buffer.concat(binaryParts);
  const json = {
    asset: { version: '2.0', generator: 'AtelierX ATEL-2 procedural hoodie generator v1' },
    scene: 0,
    scenes: [{ nodes: gltfMeshes.map((_, index) => index) }],
    nodes: gltfMeshes.map((mesh, index) => ({ mesh: index, name: mesh.name })),
    meshes: gltfMeshes,
    materials: [
      { name: 'black-cotton-fleece', pbrMetallicRoughness: { baseColorFactor: [0.025, 0.028, 0.034, 1], metallicFactor: 0, roughnessFactor: 0.96 }, doubleSided: true },
      { name: 'back-panel-black-with-skull-print', pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.96 }, doubleSided: true },
      { name: 'front-kangaroo-pocket-black-fleece', pbrMetallicRoughness: { baseColorFactor: [0.035, 0.038, 0.044, 1], metallicFactor: 0, roughnessFactor: 0.97 }, doubleSided: true },
      { name: 'rib-knit-cuffs', pbrMetallicRoughness: { baseColorFactor: [0.018, 0.02, 0.025, 1], metallicFactor: 0, roughnessFactor: 0.98 }, doubleSided: true },
      { name: 'hood-shell', pbrMetallicRoughness: { baseColorFactor: [0.03, 0.033, 0.04, 1], metallicFactor: 0, roughnessFactor: 0.98 }, doubleSided: true },
      { name: 'hood-drawcords', pbrMetallicRoughness: { baseColorFactor: [0.095, 0.098, 0.105, 1], metallicFactor: 0, roughnessFactor: 0.9 }, doubleSided: true },
    ],
    textures: [{ sampler: 0, source: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
    images: [{ name: 'hoodie-back-skull-texture-v1', bufferView: imageView, mimeType: 'image/png' }],
    accessors,
    bufferViews,
    buffers: [{ byteLength: totalBinary.length }],
  };
  const rawJson = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPadding = (4 - rawJson.length % 4) % 4;
  const jsonBytes = jsonPadding ? Buffer.concat([rawJson, Buffer.alloc(jsonPadding, 0x20)]) : rawJson;
  const binBytes = align4(totalBinary);
  const totalLength = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonBytes.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binBytes.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonBytes, binHeader, binBytes]);
}

function buildModel() {
  meshes.length = 0;
  addTorsoPanel('front-pullover-torso-plain', -Math.PI * 2 / 3, Math.PI * 2 / 3, BLACK);
  addTorsoPanel('back-pullover-torso-print-panel', Math.PI * 2 / 3, Math.PI * 4 / 3, BACK_PRINT);
  addSleeve(-1);
  addSleeve(1);
  addSleeve(-1, true);
  addSleeve(1, true);
  addHood();
  addPocket();
  addCord(-1);
  addCord(1);
  const texture = createBackTexture();
  return { glb: buildGlb(texture), texture };
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const { glb, texture } = buildModel();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'hoodie-skull-v1.glb'), glb);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'hoodie-back-skull-texture-v1.png'), texture);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'hoodie-back-skull-artwork-v1.svg'), createArtworkSvg());
  fs.writeFileSync(path.join(OUTPUT_DIR, 'asset-manifest.json'), JSON.stringify({
    order: 'ATEL-2', revision: 'v1', garment: 'black pullover hoodie MVP',
    model: 'hoodie-skull-v1.glb', texture: 'hoodie-back-skull-texture-v1.png',
    artwork: 'hoodie-back-skull-artwork-v1.svg',
    source: 'site-atel-1/tools/generate-atel2.mjs',
    formNote: 'Procedural MVP mesh; no approved base hoodie mesh or UV source was present.',
    printPlacement: 'Centered on back panel, upright, below hood; front torso has no print.',
  }, null, 2) + '\n');
  process.stdout.write(`Generated ${path.join(OUTPUT_DIR, 'hoodie-skull-v1.glb')} (${glb.length} bytes)\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

export { buildModel, createArtworkSvg };
