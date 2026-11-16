import fs from 'node:fs';
import crypto from 'node:crypto';

const sha256 = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const sourcePath = 'quality/candidates/user-supplied/tshirt.glb';
const garmentPath = 'orders/ATEL-35/v0.5/designer/garment-v0_5.glb';
const browserPath = 'quality/evidence/ATEL-35/v0.5/browser-result.json';
const sourcePreviewPath = 'quality/evidence/ATEL-35/v0.5/source-preview/source-preview.json';
const sourceSha = sha256(sourcePath);
const garmentSha = sha256(garmentPath);
const browser = JSON.parse(fs.readFileSync(browserPath, 'utf8'));
const sourcePreview = JSON.parse(fs.readFileSync(sourcePreviewPath, 'utf8'));
const buffer = fs.readFileSync(garmentPath);
if (buffer.toString('utf8', 0, 4) !== 'glTF') throw new Error('Derived file is not a GLB');
const jsonLength = buffer.readUInt32LE(12);
const gltf = JSON.parse(buffer.toString('utf8', 20, 20 + jsonLength));
const metadata = gltf.asset.extras?.atelierxStandalone;
if (!metadata) throw new Error('Missing embedded AtelierX provenance');
if (buffer.readUInt32LE(4) !== 2 || buffer.readUInt32LE(8) !== buffer.length) throw new Error('Invalid GLB header/version/length');
if (metadata.revision !== 'v0.5-gray' || metadata.derivedFrom.sha256 !== sourceSha) throw new Error('Embedded revision/source provenance mismatch');
if (gltf.meshes.some(mesh => mesh.primitives.some(primitive => primitive.attributes?.TEXCOORD_0 === undefined))) throw new Error('A source primitive lost UV0');
if (gltf.materials.some(material => material.pbrMetallicRoughness?.baseColorTexture || material.normalTexture)) throw new Error('Unexpected source color/normal texture remains bound');
if (JSON.stringify(gltf.materials[0]?.pbrMetallicRoughness?.baseColorFactor) !== JSON.stringify([0.26, 0.27, 0.28, 1])) throw new Error('Neutral gray material is missing');
if (sourceSha !== 'c21ef90d256b1f28177e8468cc9f69a83dbdd0cc4111addc23f9893e82a1103a') throw new Error('Registry source hash does not match the task');
if (browser.garmentSha256 !== garmentSha) throw new Error('Browser result does not refer to this GLB hash');
if (sourcePreview.sourceSha256 !== sourceSha) throw new Error('Source preview does not refer to this source hash');
if (!browser.loaded || !browser.rotated || !browser.zoomed || !browser.desktop || browser.errors.length) throw new Error('Desktop browser checks did not pass');
const requiredViews = ['front', 'back', 'side', 'oblique'];
if (JSON.stringify(Object.keys(browser.screenshots).sort()) !== JSON.stringify([...requiredViews].sort())) throw new Error('Browser evidence must contain exactly the four desktop views');
for (const view of requiredViews) {
  if (!fs.existsSync(browser.screenshots[view])) throw new Error(`Missing desktop screenshot: ${view}`);
  if (sha256(browser.screenshots[view]) !== browser.screenshotSha256[view]) throw new Error(`Desktop screenshot hash mismatch: ${view}`);
}

const provenance = {
  orderId: 'ATEL-35',
  revision: 'v0.5-gray',
  status: 'gray shape-review candidate; pending independent QA; not approved or published',
  source: {
    path: sourcePath,
    sha256: sourceSha,
    registryId: 'user-tshirt-c21ef90d-v1',
    registryPath: 'quality/base-meshes.json',
    registryLicense: 'owner-authorized-project-use',
    licensePolicy: 'quality/USER_SUPPLIED_BASE_POLICY.md',
    originalFile: 'phom cơ sở/tshirt.glb',
    originalAttribution: metadata.derivedFrom.originalAttribution,
  },
  derived: {
    path: garmentPath,
    sha256: garmentSha,
    meshCount: gltf.meshes.length,
    primitiveCount: gltf.meshes.reduce((sum, mesh) => sum + mesh.primitives.length, 0),
    method: metadata.method,
    material: gltf.materials.map(({ name, pbrMetallicRoughness }) => ({ name, pbrMetallicRoughness })),
  },
  normalization: metadata.displayNormalization,
  uv0: metadata.uv0,
  surfaceDetail: {
    sourceNormalTexture: Boolean(gltf.materials.some(material => material.normalTexture)),
    sourceBaseColorTexture: Boolean(gltf.materials.some(material => material.pbrMetallicRoughness?.baseColorTexture)),
    note: metadata.folds,
  },
  sourcePreview: {
    manifest: sourcePreviewPath,
    manifestSha256: sha256(sourcePreviewPath),
    url: sourcePreview.url,
    loaded: sourcePreview.loaded,
    desktop: sourcePreview.desktop,
    screenshotHashes: sourcePreview.screenshots,
  },
  desktopBrowser: {
    result: browserPath,
    resultSha256: sha256(browserPath),
    url: browser.url,
    revision: browser.revision,
    garmentSha256: browser.garmentSha256,
    loaded: browser.loaded,
    rotated: browser.rotated,
    zoomed: browser.zoomed,
    desktop: browser.desktop,
    errors: browser.errors,
    screenshots: Object.fromEntries(Object.entries(browser.screenshots).map(([view, path]) => [view, { path, sha256: browser.screenshotSha256[view] }])),
  },
};
fs.writeFileSync('orders/ATEL-35/v0.5/designer/source-uv-provenance.json', `${JSON.stringify(provenance, null, 2)}\n`);

const shapeReview = {
  orderId: 'ATEL-35',
  revision: 'v0.5-gray',
  garment: { path: garmentPath, sha256: garmentSha },
  sourceProvenance: {
    path: 'orders/ATEL-35/v0.5/designer/source-uv-provenance.json',
    sha256: sha256('orders/ATEL-35/v0.5/designer/source-uv-provenance.json'),
  },
  evidence: {
    browserResult: { path: browserPath, sha256: sha256(browserPath), loaded: browser.loaded, rotated: browser.rotated, zoomed: browser.zoomed, desktop: browser.desktop, errors: browser.errors },
    front: provenance.desktopBrowser.screenshots.front,
    back: provenance.desktopBrowser.screenshots.back,
    side: provenance.desktopBrowser.screenshots.side,
    oblique: provenance.desktopBrowser.screenshots.oblique,
  },
  checks: {
    garmentType: {
      pass: true,
      observation: 'Bốn ảnh xám đọc là áo thun tay ngắn cổ tròn, không có nẹp/khuy polo và không có mannequin/cơ thể.',
      evidence: ['quality/evidence/ATEL-35/v0.5/front.png', 'quality/evidence/ATEL-35/v0.5/oblique.png'],
    },
    connectedParts: {
      pass: true,
      observation: 'Thân, vai và tay đọc thành một áo trong bốn góc; không thấy mảnh bay hoặc khe hở rõ. QA độc lập nên xem kỹ điểm ráp nách bên phải người mặc, nơi ảnh front có một nếp/góc nhỏ.',
      evidence: ['quality/evidence/ATEL-35/v0.5/front.png', 'quality/evidence/ATEL-35/v0.5/back.png', 'quality/evidence/ATEL-35/v0.5/side.png', 'quality/evidence/ATEL-35/v0.5/oblique.png'],
    },
    structure: {
      pass: true,
      observation: 'Dải bo cổ tròn liên tục, thân có volume và nếp gấp nhẹ nhìn được ở xám. Source không có color/normal texture; detail nếp đến từ geometry và vertex normals, không phải texture. Đây là pre-review của Designer, chưa phải phê duyệt hình dáng độc lập.',
      evidence: ['quality/evidence/ATEL-35/v0.5/front.png', 'quality/evidence/ATEL-35/v0.5/back.png', 'quality/evidence/ATEL-35/v0.5/side.png', 'quality/evidence/ATEL-35/v0.5/oblique.png'],
    },
  },
  decision: 'pending-independent-review',
  reviewer: 'atelierx-designer-0003 (pre-review; independent QA pending)',
  summary: 'Source and output SHA-256 match the recorded artifacts; UV0 is retained on all four source primitives. Desktop browser loaded, rotated and zoomed successfully. Ready for Lead/QA independent shape review; not approved or published.',
};
fs.writeFileSync('orders/ATEL-35/v0.5/shape-review.json', `${JSON.stringify(shapeReview, null, 2)}\n`);
console.log(JSON.stringify({
  sourceSha256: sourceSha,
  garmentSha256: garmentSha,
  sourceProvenanceSha256: sha256('orders/ATEL-35/v0.5/designer/source-uv-provenance.json'),
  shapeReviewSha256: sha256('orders/ATEL-35/v0.5/shape-review.json'),
  browserResultSha256: sha256(browserPath),
}, null, 2));
