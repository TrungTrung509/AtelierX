import assert from 'node:assert/strict';
import test from 'node:test';
import {assessProduct} from './quality-gate.mjs';

const product = {id:'ATEL-9',revision:'v1',status:'complete',viewer:'showcase/products/ATEL-9/v1/index.html',model:'showcase/products/ATEL-9/v1/model.glb'};
const report = {
  orderId:'ATEL-9',revision:'v1',brief:{garmentType:'hoodie',requiredFeatures:['đen','đầu lâu ở lưng']},
  featureChecks:[{feature:'đen',passed:true,evidence:'front.png'},{feature:'đầu lâu ở lưng',passed:true,evidence:'back.png'}],
  assets:{baseMeshId:'hoodie-a',artwork:'art.png',model:product.model,viewer:product.viewer},
  browser:{url:'http://127.0.0.1:8787/atelierx-products/products/ATEL-9/v1/index.html',loaded:true,rotated:true,zoomed:true,desktop:true,mobile:true},
  evidence:Object.fromEntries(['front','back','left','right','detail','mobile'].map(x => [x,`${x}.png`])),
  scores:{silhouette:4,construction:4,artwork:5,placement:4,material:4,web:4},
  blockers:[],qaReviewer:'Technical Designer / QA',leadApproved:true
};
const library = {meshes:[{id:'hoodie-a',status:'approved',garmentType:'hoodie',file:'base.glb',licenseFile:'license.txt',placementProfile:'placement.json',source:'studio',license:'original',approvedBy:'QA',evidence:{front:'bf.png',back:'bb.png',left:'bl.png',right:'br.png'}}]};
product.deliveryProfile = report.deliveryProfile = 'mannequin-v1';
product.content = report.assets.content = 'products/ATEL-9/v1/content.json';
report.display = {mannequinFile:'mannequin.glb',mannequinSha256:'a'.repeat(64),modelSha256:'b'.repeat(64),checks:Object.fromEntries(['fullBody','headHandsFeet','garmentFitted','noClipping','artworkVisible','contentVisible'].map(k=>[k,true])),evidence:{fullBody:'full.png',fitDetail:'fit.png',content:'content.png'}};
test('đơn mới thiếu mannequin/content bị chặn', () => {
  const bad = structuredClone(report);
  delete bad.deliveryProfile;
  bad.display.checks.noClipping = false;
  assert(assessProduct(product,bad,library,()=>true).some(x=>x.includes('noClipping')));
  assert(assessProduct(product,bad,library,()=>true).some(x=>x.includes('deliveryProfile')));
});
test('bản đạt đủ bằng chứng qua cổng', () => assert.deepEqual(assessProduct(product, report, library, () => true), []));
test('thiếu phom, browser và điểm thị giác chặn complete', () => {
  const bad = structuredClone(report);
  bad.browser.loaded = false;
  bad.scores.silhouette = 2;
  const errors = assessProduct(product, bad, {meshes:[]}, () => true);
  assert(errors.some(x => x.includes('Phom nền')));
  assert(errors.some(x => x.includes('Browser QA')));
  assert(errors.some(x => x.includes('silhouette')));
});
test('khác revision hoặc catalog trỏ asset khác bị chặn', () => {
  const bad = structuredClone(report);
  bad.revision = 'v2';
  bad.assets.model = 'showcase/products/ATEL-9/v2/model.glb';
  const errors = assessProduct(product, bad, library, () => true);
  assert(errors.some(x => x.includes('revision')));
  assert(errors.some(x => x.includes('Catalog')));
});
test('thiếu kiểm một chi tiết trong brief bị chặn', () => {
  const bad = structuredClone(report);
  bad.featureChecks.pop();
  assert(assessProduct(product,bad,library,() => true).some(x => x.includes('đầu lâu ở lưng')));
});
