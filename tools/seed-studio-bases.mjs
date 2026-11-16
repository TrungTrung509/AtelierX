import fs from 'node:fs';
import {inside,sha} from './studio-base.mjs';
// Promote only the exact geometry already accepted in the finished ATEL-35.
const report=JSON.parse(fs.readFileSync(inside('quality/reports/ATEL-35/v1.json'),'utf8'));
const review=JSON.parse(fs.readFileSync(inside('orders/ATEL-35/v0.5/independent-shape-review.json'),'utf8'));
if(report.decision!=='pass'||report.leadApproved!==true||review.decision!=='pass'||sha(inside(review.garment.path))!==review.garment.sha256)throw Error('Phom tái sử dụng chưa đủ bằng chứng');
const file=inside('quality/studio-bases.json');
const library=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{version:9,bases:[]};
const bases=[{
  id:'tee-crew-short-sleeve-v1',garmentType:'tshirt',status:'ready',file:review.garment.path,sha256:review.garment.sha256,
  features:{neck:'crew',sleeves:'short',folds:true,volume:true},
  images:Object.fromEntries(['front','back','side','oblique'].map(k=>[k,review.evidence[k].path])),
  shapeReview:'orders/ATEL-35/v0.5/independent-shape-review.json',
  placementProfile:'orders/ATEL-35/visual/placement-profile-v1.json',
  materialPreset:'orders/ATEL-35/material/pbr-preset-v1.json',
  successfulOrders:['ATEL-35/v1'],
  limitations:['Mesh trước/sau chồng UV; dùng flowerMaterialMeshes [1,2], creamOnlyMeshes [0,3] từ placement profile.','Được tái dùng nguyên geometry; đổi cổ/tay/dáng cần QA phom mới.'],
},
  ...[
    ['quality/candidates/makehuman-tshirt.glb','Phom méo; đã loại trong BASE_AUDIT.md.'],
    ['quality/candidates/user-supplied/t-shirt.glb','Không phù hợp áo thun cổ tròn: v0.1 đọc thành polo.'],
    ['quality/candidates/user-supplied/t-shirt (1).glb','Không phù hợp mức hiển thị mong muốn: bo cổ/nếp gấp không rõ.'],
    ['quality/candidates/user-supplied/t-shirt___lp.glb','Áo dài tay raglan có nẹp ba khuy, không phải áo thun tay ngắn cổ tròn.'],
  ].map(([file,reason])=>({id:'exclude-'+file.split('/').pop(),garmentType:'tshirt',status:'rejected',file,reason,scope:'Áo thun tay ngắn cổ tròn; nguồn khác loại vẫn có thể dùng cho brief phù hợp sau kiểm ảnh.'})),
];
for(const base of bases){library.bases=library.bases.filter(b=>b.id!==base.id);library.bases.push(base)}
fs.writeFileSync(file,JSON.stringify(library,null,2)+'\n');
console.log('Studio base library:',library.bases.length,'cards; ready tee with checked geometry and UV');
