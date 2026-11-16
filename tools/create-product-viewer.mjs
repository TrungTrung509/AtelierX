import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, revision] = process.argv.slice(2);
if (!/^ATEL-\d+$/.test(id || '') || !/^v[\w.-]+$/.test(revision || '')) throw new Error('Usage: node tools/create-product-viewer.mjs ATEL-n vN');
const dir = path.join(root, 'showcase/products', id, revision);
if (fs.existsSync(path.join(dir, 'index.html'))) throw new Error('Revision already exists; choose a new revision');
fs.mkdirSync(path.join(dir, 'assets'), {recursive:true});
fs.writeFileSync(path.join(dir, 'content.json'), JSON.stringify({orderId:id,revision,title:'',summary:'',paragraphs:[],details:[],credits:['Mannequin: zveoxic / Sketchfab — CC BY 4.0; https://sketchfab.com/3d-models/mannequin--model-59460931b9cb43f98c97991300c920fb; thay đổi: căn tỷ lệ/vị trí cho trưng bày.']},null,2));
fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${id} · ${revision}</title>
<style>body{margin:0;background:#cbd2d8;color:#18212b;font:16px/1.65 system-ui,sans-serif}main{max-width:1320px;margin:auto;padding:24px;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,1fr);gap:28px}model-viewer{width:100%;height:78vh;min-height:460px;background:radial-gradient(#e4e8eb,#aab4be);border-radius:16px}article{background:#f7f8f9;padding:28px;border-radius:16px}h1{line-height:1.2}#product-credits{font-size:12px;color:#52616e;overflow-wrap:anywhere}button{padding:10px;margin:8px;border:1px solid #52616e;border-radius:8px;background:#fff}@media(max-width:760px){main{grid-template-columns:1fr;padding:16px}model-viewer{height:65vh;min-height:360px}}</style>
<script type="module" src="/atelierx-products/assets/model-viewer.min.js"></script></head>
<body><main><section><model-viewer id="hoodie" src="./assets/display.glb" camera-controls shadow-intensity="1.2" exposure="1.1" alt="Trang phục trên ma nơ canh toàn thân" loading="eager"></model-viewer><p id="loading">Đang tải mẫu…</p><p id="error" hidden>Không tải được mẫu.</p><button id="view-front">Mặt trước</button><button id="view-back">Mặt sau</button></section>
<article id="product-content"><h1 id="product-title">${id}</h1><p id="product-summary"></p><div id="product-paragraphs"></div><ul id="product-details"></ul><div id="product-credits"></div><p id="content-error" hidden>Chưa tải được mô tả sản phẩm.</p></article></main>
<script type="module" src="/atelierx-products/assets/viewer.js"></script></body></html>`);
console.log(`Created ${id}/${revision}: Visual owns display.glb/viewer; Researcher fills content.json. Catalog remains unchanged.`);
