import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {assessBasic} from './showcase-basic-gate.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scoreNames = ['silhouette', 'construction', 'artwork', 'placement', 'material', 'web'];
const viewNames = ['front', 'back', 'left', 'right', 'detail', 'mobile'];
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function insideProject(relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) return null;
  const resolved = path.resolve(root, relative);
  return resolved.startsWith(root + path.sep) ? resolved : null;
}

export function assessProduct(product, report, library, fileExists = fs.existsSync) {
  if (product.deliveryProfile === 'showcase-basic-v1') return assessBasic(product, report, fileExists);
  const errors = [];
  const checkFile = (label, relative) => {
    const target = insideProject(relative);
    if (!target || !fileExists(target)) errors.push(`${label}: thiếu file hợp lệ (${relative || 'trống'})`);
  };
  const checkCatalogFile = (label, relative) => {
    // Catalog asset paths are relative to showcase/, while report evidence and
    // other project artifacts are relative to the project root.
    const target = typeof relative === 'string' && relative && !path.isAbsolute(relative)
      ? insideProject(path.join('showcase', relative))
      : null;
    if (!target || !fileExists(target)) errors.push(`${label}: thiếu file hợp lệ trong showcase (${relative || 'trống'})`);
  };
  if (!report || typeof report !== 'object') return ['Thiếu phiếu QA theo revision'];
  // Existing ATEL-1/v3 keeps its historical acceptance; every future delivery uses the mannequin contract.
  if (!(product.id === 'ATEL-1' && product.revision === 'v3')) {
    if (product.deliveryProfile !== 'mannequin-v1' || report.deliveryProfile !== 'mannequin-v1') errors.push('Đơn mới cần deliveryProfile mannequin-v1 trong catalog và QA');
    const display = report.display || {};
    checkFile('Mannequin cơ sở', display.mannequinFile);
    if (!/^[a-f0-9]{64}$/i.test(display.mannequinSha256 || '')) errors.push('Thiếu SHA mannequin');
    if (!/^[a-f0-9]{64}$/i.test(display.modelSha256 || '')) errors.push('Thiếu SHA display model');
    for (const [file, hash, label] of [[display.mannequinFile, display.mannequinSha256, 'mannequin'], [typeof product.model === 'string' ? path.join('showcase',product.model) : null, display.modelSha256, 'display model']]) {
      const target = insideProject(file);
      if (target && fs.existsSync(target) && createHash('sha256').update(fs.readFileSync(target)).digest('hex') !== hash) errors.push(`SHA ${label} không khớp file hiện tại`);
    }
    for (const key of ['fullBody','headHandsFeet','garmentFitted','noClipping','artworkVisible','contentVisible']) {
      if (display.checks?.[key] !== true) errors.push(`Mannequin/content QA chưa đạt ${key}`);
    }
    checkFile('Ảnh fit toàn thân', display.evidence?.fullBody);
    checkFile('Ảnh kiểm giao áo/cơ thể', display.evidence?.fitDetail);
    checkFile('Ảnh content trong viewer', display.evidence?.content);
    checkCatalogFile('Content sản phẩm', product.content);
    if (report.assets?.content !== product.content) errors.push('Content catalog/QA không cùng đường dẫn');
    const contentFile = typeof product.content === 'string' ? insideProject(path.join('showcase', product.content)) : null;
    if (contentFile && fs.existsSync(contentFile)) {
      try {
        const c = readJson(contentFile);
        if (c.orderId !== product.id || c.revision !== product.revision || !c.title?.trim() || !c.summary?.trim() || !Array.isArray(c.paragraphs) || c.paragraphs.length < 2 || c.paragraphs.some(p => typeof p !== 'string' || !p.trim()) || !Array.isArray(c.details) || c.details.length < 3 || !Array.isArray(c.credits) || !c.credits.length) errors.push('Content thiếu mô tả chi tiết, điểm nổi bật, ghi công hoặc sai revision');
      } catch { errors.push('Content JSON không đọc được'); }
    }
  }
  if (product.id !== report.orderId || product.revision !== report.revision) errors.push('Mã đơn/revision của catalog và QA không trùng');
  const requiredFeatures = Array.isArray(report.brief?.requiredFeatures) ? report.brief.requiredFeatures : [];
  if (requiredFeatures.length === 0) errors.push('Thiếu ràng buộc brief để đối chiếu');
  for (const feature of requiredFeatures) {
    const check = report.featureChecks?.find(item => item.feature === feature);
    if (!check || check.passed !== true) errors.push(`Brief chưa được xác nhận: ${feature}`);
    else checkFile(`Bằng chứng brief ${feature}`, check.evidence);
  }

  const base = library.meshes?.find(mesh => mesh.id === report.assets?.baseMeshId);
  if (!base || base.status !== 'approved') errors.push('Phom nền chưa có trong thư viện approved');
  else if (base.garmentType !== report.brief?.garmentType) errors.push('Phom nền không khớp loại sản phẩm');
  if (base) {
    checkFile('Phom nền', base.file);
    checkFile('Giấy phép/nguồn phom', base.licenseFile);
    checkFile('Placement profile', base.placementProfile);
    for (const key of ['front','back','left','right']) checkFile(`Ảnh duyệt phom ${key}`, base.evidence?.[key]);
    if (!base.source || !base.license || !base.approvedBy) errors.push('Phom thiếu nguồn, quyền sử dụng hoặc người duyệt');
  }
  checkFile('artwork', report.assets?.artwork);
  for (const key of ['model', 'viewer']) checkCatalogFile(key, report.assets?.[key]);

  for (const key of ['loaded', 'rotated', 'zoomed', 'desktop', 'mobile']) {
    if (report.browser?.[key] !== true) errors.push(`Browser QA chưa xác nhận ${key}`);
  }
  if (!String(report.browser?.url || '').includes(`/atelierx-products/products/${product.id}/${product.revision}/`)) errors.push('Browser QA chưa dùng đúng viewer nội bộ Crewly');
  for (const key of viewNames) checkFile(`Ảnh browser ${key}`, report.evidence?.[key]);
  for (const key of scoreNames) {
    if (!Number.isInteger(report.scores?.[key]) || report.scores[key] < 4 || report.scores[key] > 5) errors.push(`Điểm ${key} chưa đạt 4/5`);
  }
  if (!Array.isArray(report.blockers)) errors.push('Thiếu danh sách lỗi chặn');
  else if (report.blockers.length) errors.push(`Còn ${report.blockers.length} lỗi chặn`);
  if (!report.qaReviewer || !report.leadApproved) errors.push('Thiếu QA độc lập hoặc phê duyệt của Studio Lead');
  if (product.viewer !== report.assets?.viewer || product.model !== report.assets?.model) errors.push('Catalog không trỏ đúng model/viewer được QA');
  return errors;
}

export function checkCatalog(catalog, reports, library, fileExists = fs.existsSync) {
  return (catalog.products || []).filter(product => product.status === 'complete').flatMap(product => {
    const report = reports[`${product.id}/${product.revision}`];
    return assessProduct(product, report, library, fileExists).map(error => `${product.id}/${product.revision}: ${error}`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = readJson(path.join(root, 'showcase/catalog.json'));
  const library = readJson(path.join(root, 'quality/base-meshes.json'));
  const reports = {};
  for (const product of catalog.products || []) {
    const file = path.join(root, 'quality/reports', product.id, `${product.revision}.json`);
    if (fs.existsSync(file)) reports[`${product.id}/${product.revision}`] = readJson(file);
  }
  const selected = process.argv.indexOf('--product');
  const products = selected >= 0 ? catalog.products.filter(p => p.id === process.argv[selected + 1]) : catalog.products.filter(p => p.status === 'complete');
  if (selected >= 0 && products.length === 0) throw new Error('Không tìm thấy sản phẩm trong catalog');
  const errors = products.flatMap(p => assessProduct(p, reports[`${p.id}/${p.revision}`], library).map(error => `${p.id}/${p.revision}: ${error}`));
  if (process.argv.includes('--publish')) {
    if (selected < 0 || products.length !== 1) errors.push('Để công bố cần --product <mã đơn>');
    if (errors.length === 0) {
      products[0].status = 'complete';
      products[0].statusLabel = 'Hoàn thành · chờ bạn xem';
      const dest = path.join(root, 'showcase/catalog.json');
      const tmp = `${dest}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(catalog, null, 2) + '\n');
      fs.renameSync(tmp, dest);
    }
  }
  console.log(JSON.stringify({checked: products.map(p => `${p.id}/${p.revision}`), passed: errors.length === 0, errors}, null, 2));
  if (errors.length) process.exitCode = 1;
}
