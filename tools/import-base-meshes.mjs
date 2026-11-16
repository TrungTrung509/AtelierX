import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.resolve(project, '..', 'phom cơ sở');
const targetDir = path.join(project, 'quality', 'candidates', 'user-supplied');
const previewDir = path.join(project, 'showcase', 'quality-preview', 'user-supplied');
const manifestPath = path.join(project, 'quality', 'base-meshes.json');
const types = {
  'basic_sweatshirt.glb': 'sweatshirt',
  'canada_goose_winter_jacket.glb': 'jacket',
  'caterpillar_work_boot.glb': 'footwear',
  'cheap_shearling_jacket_agisoftclotheschallenge.glb': 'jacket',
  'classic_black_flame_hoodie.glb': 'hoodie',
  'cloth_jacket.glb': 'jacket',
  'coat_leather_jacket_3d_model_free.glb': 'jacket',
  'fleece_jacket.glb': 'jacket',
  'green_and_white_hoodie.glb': 'hoodie',
  'japanese_school_uniform.glb': 'outfit',
  'jeans_skirt.glb': 'skirt',
  'jk_school_uniform_4.glb': 'outfit',
  'jnco_twin_cannon_baggy_jeans.glb': 'pants',
  'make_me_purr_crop_top.glb': 'top',
  'man_black_business_suit.glb': 'outfit',
  'my_sweet_piano_pants_with_bones.glb': 'pants',
  'nike_air_zoom_pegasus_36.glb': 'footwear',
  'oversized_baggy_custom_jeans.glb': 'pants',
  'plaid_gothic_mini_skirt.glb': 'skirt',
  'puff_sleeve_and_jumper_skirt.glb': 'outfit',
  'real_army_jacket.glb': 'jacket',
  'regular_clothes_for_vespian.glb': 'outfit',
  't-shirt (1).glb': 'tshirt',
  't-shirt.glb': 'tshirt',
  't-shirt___lp.glb': 'tshirt',
  't_shirt.glb': 'tshirt',
  'tommy_hilfiger_jacket.glb': 'jacket',
  'tshirt.glb': 'tshirt',
  'white_shirt_black_leather_skirt_outfit.glb': 'outfit',
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const imported = [];
fs.mkdirSync(targetDir, {recursive: true});
fs.mkdirSync(path.join(previewDir, 'assets'), {recursive: true});
for (const name of Object.keys(types)) {
  const source = path.join(sourceDir, name);
  const bytes = fs.readFileSync(source);
  if (bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error(`GLB không hợp lệ: ${name}`);
  const jsonLength = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
  const primitives = gltf.meshes?.flatMap(mesh => mesh.primitives || []) || [];
  if (!primitives.length || !primitives.some(p => p.attributes?.POSITION !== undefined)) throw new Error(`GLB thiếu mesh POSITION: ${name}`);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const id = `user-${name.replace(/\.glb$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sha256.slice(0, 8)}-v1`;
  const target = path.join(targetDir, name);
  if (!fs.existsSync(target)) fs.copyFileSync(source, target);
  else if (crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') !== sha256) throw new Error(`File đã nhập khác nguồn: ${name}`);
  const previewAsset = path.join(previewDir, 'assets', name);
  if (!fs.existsSync(previewAsset)) {
    try {fs.linkSync(target, previewAsset);} catch {fs.copyFileSync(target, previewAsset);}
  }
  if (crypto.createHash('sha256').update(fs.readFileSync(previewAsset)).digest('hex') !== sha256) throw new Error(`Preview khác ứng viên: ${name}`);
  const existing = manifest.meshes.find(item => item.originalFile === `phom cơ sở/${name}`);
  if (existing) {
    existing.id = id;
    existing.source = 'user-supplied:phom cơ sở';
    existing.license = 'owner-authorized-project-use';
    existing.licenseFile = 'quality/USER_SUPPLIED_BASE_POLICY.md';
    existing.notes = 'Chủ dự án cho phép dùng làm phom tham khảo hoặc dẫn xuất trong AtelierX; ưu tiên thiết kế lại kiểu dáng, màu, vật liệu và họa tiết. Chưa qua QA phom/UV/vùng in; chỉ dùng cho đơn complete sau khi G1 approved.';
  }
  else manifest.meshes.push({
    id, garmentType: types[name], status: 'candidate',
    file: `quality/candidates/user-supplied/${name}`,
    originalFile: `phom cơ sở/${name}`,
    source: 'user-supplied:phom cơ sở', license: 'owner-authorized-project-use', licenseFile: 'quality/USER_SUPPLIED_BASE_POLICY.md', sha256,
    inspection: {glbValid: true, meshCount: gltf.meshes.length, primitiveCount: primitives.length, hasUV0: primitives.some(p => p.attributes?.TEXCOORD_0 !== undefined)},
    notes: 'Chủ dự án cho phép dùng làm phom tham khảo hoặc dẫn xuất trong AtelierX; ưu tiên thiết kế lại kiểu dáng, màu, vật liệu và họa tiết. Chưa qua QA phom/UV/vùng in; chỉ dùng cho đơn complete sau khi G1 approved.'
  });
  imported.push({id, type: types[name], bytes: bytes.length, hasUV0: primitives.some(p => p.attributes?.TEXCOORD_0 !== undefined)});
}
const tmp = `${manifestPath}.${process.pid}.tmp`;
fs.writeFileSync(tmp, JSON.stringify(manifest, null, 2) + '\n');
fs.renameSync(tmp, manifestPath);
const entries = imported.map(item => {
  const mesh = manifest.meshes.find(m => m.id === item.id);
  return {name: path.basename(mesh.file), type: item.type, url: `./assets/${encodeURIComponent(path.basename(mesh.file))}`};
});
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Phom cơ sở · ứng viên AtelierX</title><script type="module" src="/atelierx-products/assets/model-viewer.min.js"></script><style>body{margin:0;background:#dce4e8;color:#172329;font:15px system-ui}main{max-width:1300px;margin:auto;padding:24px}h1{margin:0 0 8px}p{max-width:850px}select{font:inherit;padding:10px;background:white;border:1px solid #9caeb7;border-radius:8px;max-width:100%}model-viewer{display:block;width:100%;height:75vh;background:#e7ecef;border-radius:16px;margin-top:16px}small{display:block;margin-top:10px}</style></head><body><main><h1>Thư viện phom ứng viên</h1><p>29 file do chủ dự án cung cấp và cho phép dùng trong AtelierX. Ưu tiên biến đổi kiểu dáng, màu, vật liệu và họa tiết. Phom/vùng in chưa qua QA nên chưa dùng cho sản phẩm hoàn chỉnh.</p><label for="mesh">Chọn phom</label> <select id="mesh"></select><model-viewer id="viewer" camera-controls shadow-intensity="1" exposure="1" interaction-prompt="none" alt="Phom ứng viên"></model-viewer><small id="status"></small></main><script>const entries=${JSON.stringify(entries)};const select=document.getElementById('mesh');const viewer=document.getElementById('viewer');const status=document.getElementById('status');entries.forEach((x,i)=>{const o=document.createElement('option');o.value=i;o.textContent=x.name+' · '+x.type;select.append(o)});function show(){const x=entries[Number(select.value)];viewer.src=x.url;status.textContent=x.name+' · candidate · được phép dùng trong project, chờ QA phom/vùng in'}select.addEventListener('change',show);show();</script></body></html>`;
fs.writeFileSync(path.join(previewDir, 'index.html'), html);
console.log(JSON.stringify({count: imported.length, imported}, null, 2));
