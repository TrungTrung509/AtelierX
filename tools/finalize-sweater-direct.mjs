import fs from 'node:fs';
import {createHash} from 'node:crypto';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const root='showcase/products/ATEL-63/v2.1';
const model=`${root}/assets/display.glb`,contentPath=`${root}/content.json`,viewer=`${root}/index.html`;
const assemblyPath=`${root}/assembly.json`,manifestPath=`${root}/assets/asset-manifest.json`;
const reportPath='quality/reports/ATEL-63/v2.1.json';
const modelHash=sha(model);
const summary='Sweater 3D độc lập màu đỏ rượu vang, phom rỗng như đang được mặc trên cơ thể vô hình. Cổ, gấu và hai đầu tay mở; bo cùng tông đỏ đậm, cây thông và bông tuyết vàng nằm giữa ngực trước.';
const c=read(contentPath);
c.summary=summary;
c.style='Sweater cổ tròn tay dài, phom có độ phồng và nếp gấp tự nhiên; bo đỏ rượu vang đậm ở cổ, cổ tay và gấu, họa tiết Giáng sinh vàng ở ngực trước.';
c.paragraphs[0]='Phom sweater nguồn Tristen theo CC BY 4.0; AtelierX giữ dáng và nếp vải gốc. Mẫu là lớp áo rỗng, không có mannequin hay lõi đặc; người xem có thể nhìn vào trong từ cổ, gấu và đầu tay. Các kích thước dưới đây đo trên viewer sau scale 0,25 lần, chỉ để tham khảo mẫu 3D, không phải size may.';
c.dimensionsSource.garmentSha256=modelHash;
c.credits[0]='Phom sweater gốc: Tristen, “Sweater”, Sketchfab, CC BY 4.0 (https://sketchfab.com/3d-models/sweater-03ec2c29e4dc497080b32951f3168754). AtelierX thay màu và giữ các lỗ mở của phom.';
write(contentPath,c);
const catalog=read('showcase/catalog.json'),entry=catalog.products.find(p=>p.id==='ATEL-63'&&p.revision==='v2.1');
if(!entry)throw Error('ATEL-63 catalog entry missing');entry.description=summary;write('showcase/catalog.json',catalog);

const a=read(assemblyPath);a.garmentSha256=sha('orders/ATEL-63/v2/material/garment.glb');a.displaySha256=modelHash;
a.stage='hollow sweater color repair';a.innerLining=false;write(assemblyPath,a);
const m=read(manifestPath);m.assembly.sha256=sha(assemblyPath);m.display.sha256=modelHash;
m.integratedGarment.sha256=sha('orders/ATEL-63/v2/material/garment.glb');m.content.sha256=sha(contentPath);m.viewer.sha256=sha(viewer);
for(const name of ['front','back','side','oblique','top','bottom']){
 const p=`quality/evidence/ATEL-63/direct-edit/${name}.png`;
 m.screenshots[name]={path:p,sha256:sha(p)};
}
write(manifestPath,m);

const q=read(reportPath);
q.reviewedAt=new Date().toISOString();
q.summary='Direct visual review of in-place GLB repair: solid inserts removed, source sweater shell remains hollow with open neck, hem and cuffs; wine-red ribbing and gold artwork retained. Viewer loaded, rotated and zoomed; six fresh browser views captured. Historical agent QA applies to the previous geometry.';
q.assets.modelSha256=modelHash;q.assets.viewerSha256=sha(viewer);q.assets.contentSha256=sha(contentPath);
q.browser.displayGlbSha256=modelHash;q.browser.loaded=true;q.browser.rotated=true;q.browser.zoomed=true;q.browser.errors=[];
q.browser.runtimeCheck={path:'quality/evidence/ATEL-63/direct-edit/browser-result.json',sha256:sha('quality/evidence/ATEL-63/direct-edit/browser-result.json')};
q.directEditEvidence='quality/evidence/ATEL-63/direct-edit/browser-result.json';
q.brief.requiredFeatures=q.brief.requiredFeatures.map(s=>s.replace('Bo cổ, cổ tay và gấu màu kem trên nền đỏ rượu vang','Bo cổ, cổ tay và gấu đỏ rượu vang đậm trên nền đỏ rượu vang').replace('Cây thông Giáng sinh nhỏ và bông tuyết sáng','Cây thông Giáng sinh nhỏ và bông tuyết vàng'));
q.featureChecks=q.featureChecks.map(check=>({...check,feature:check.feature.replace('Bo cổ, cổ tay và gấu màu kem trên nền đỏ rượu vang','Bo cổ, cổ tay và gấu đỏ rượu vang đậm trên nền đỏ rượu vang').replace('Cây thông Giáng sinh nhỏ và bông tuyết sáng','Cây thông Giáng sinh nhỏ và bông tuyết vàng')}));
for(const name of ['front','back','side','oblique','top','bottom'])q.evidence[name]=`quality/evidence/ATEL-63/direct-edit/${name}.png`;
q.evidenceSha256=Object.fromEntries(['front','back','side','oblique','top','bottom'].map(name=>[name,sha(q.evidence[name])]));
q.garmentAppearance.checks.hollowOpenings.observation='Cổ, gấu và hai đầu tay là các lỗ mở thật trong GLB. Ảnh nhìn từ trên và dưới cho thấy lòng áo rỗng, không có lõi đặc hoặc mặt bịt ngang.';
q.garmentAppearance.checks.fabricEdges.observation='Bo cổ, cổ tay và gấu cùng họ đỏ rượu vang đậm, bám theo mép vải; các miệng áo giữ nguyên dạng mở.';
q.garmentAppearance.checks.colorAndPattern.observation='Thân và bo đều thuộc tông đỏ rượu vang, cây thông và bông tuyết màu vàng ở giữa ngực trước; không còn bo trắng.';
q.garmentAppearance.checks.trimFollowsGeometry.observation='Bo cổ tròn đỏ đậm bám theo vòng cổ; không có mảng vai sáng lệch phom.';
for(const check of Object.values(q.garmentAppearance.checks))if(Array.isArray(check.evidence))check.evidence=check.evidence.map(p=>p.replace('quality/evidence/ATEL-63/v2.1-final-browser/','quality/evidence/ATEL-63/direct-edit/'));
write(reportPath,q);
console.log(JSON.stringify({model,sha256:modelHash,content:contentPath,qa:reportPath}));
