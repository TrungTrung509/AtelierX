import fs from 'node:fs';
import crypto from 'node:crypto';
import {readGlb,primitives} from './showcase-glb.mjs';

const root='showcase/products/ATEL-41/v4';
const model=`${root}/assets/display.glb`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const save=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const modelSha=sha(model);
const parts=primitives(readGlb(model));
const low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
for(const part of parts)for(const point of part.points)for(let k=0;k<3;k++){
 low[k]=Math.min(low[k],point[k]);high[k]=Math.max(high[k],point[k]);
}
const width=(high[0]-low[0])*100,length=(high[1]-low[1])*100,depth=(high[2]-low[2])*100;
const dimensions=read(`${root}/measurements.json`);
Object.assign(dimensions,{envelopeWidthCm:width,garmentLengthCm:length,envelopeDepthCm:depth});
save(`${root}/measurements.json`,dimensions);
const content=read(`${root}/content.json`);
content.summary=`Quần cargo be cát dáng ống suông trưng bày độc lập, có hai túi hộp nổi và nắp túi ở đùi, đường may rõ, đỉa thắt lưng, nút trước và dây rút gấu. Bề mặt mô phỏng twill cotton-canvas màu be cát (#C8B58F), thân quần lì với nắp túi có độ bóng nhẹ. Kích thước bao model hiển thị: rộng ${width.toFixed(2).replace('.',',')} × dài ${length.toFixed(2).replace('.',',')} × sâu ${depth.toFixed(2).replace('.',',')} cm; đây là thông số 3D, không phải size may.`;
content.material.roughnessFactor=.68;
content.material.source='orders/ATEL-41/material/pbr-preset-v1.json; direct GLB detail edit: tools/enhance-cargo-detail.mjs';
for(let i=0;i<3;i++){
 const spec=content.specifications[i];
 spec.value=+(i===0?width:i===1?length:depth).toFixed(2);
 spec.source=`${model}; world-space mesh bounds; SHA-256 ${modelSha}`;
}
content.directEdit={model,sha256:modelSha,tool:'tools/enhance-cargo-detail.mjs',browserEvidence:'quality/evidence/ATEL-41/v4/cargo-detail-current/browser-result.json'};
save(`${root}/content.json`,content);
const assembly=read(`${root}/assembly.json`);
assembly.stage='owner-requested-direct-edit';
assembly.status='preview';
assembly.displaySha256=modelSha;
assembly.measurements=dimensions;
assembly.boundsMeters={min:low,max:high};
assembly.warnings=['GLB details edited directly; browser smoke passed. Prior QA report is historical and does not approve this edit.'];
save(`${root}/assembly.json`,assembly);
const catalog=read('showcase/catalog.json'),product=catalog.products.find(x=>x.id==='ATEL-41');
if(!product)throw Error('ATEL-41 missing from catalog');
product.status='preview';
product.statusLabel='Đã chỉnh chi tiết · chờ bạn đánh giá';
product.description=content.summary;
product.qualityFeedback='Túi hộp, nắp túi, đường may, đỉa cạp và vật liệu đã được chỉnh trực tiếp trên GLB. QA trước đó là lịch sử; bản này đang chờ chủ dự án xem hình dáng và chi tiết.';
save('showcase/catalog.json',catalog);
const manifest=read(`${root}/assets/asset-manifest.json`);
for(const field of ['assembly','display','content','viewer','measurements'])manifest[field].sha256=sha(manifest[field].path);
const evidenceRoot='quality/evidence/ATEL-41/v4/cargo-detail-current';
manifest.browserEvidence=Object.fromEntries(['browserResult','front','back','side','oblique','top','bottom'].map(name=>{
 const p=`${evidenceRoot}/${name==='browserResult'?'browser-result.json':name+'.png'}`;
 return [name,{path:p,sha256:sha(p)}];
}));
manifest.directEdit={model:{path:model,sha256:modelSha},tool:'tools/enhance-cargo-detail.mjs',review:'owner-pending'};
save(`${root}/assets/asset-manifest.json`,manifest);
console.log(JSON.stringify({modelSha,dimensions:{widthCm:width,lengthCm:length,depthCm:depth},catalogStatus:product.status,filesSynced:5}));
