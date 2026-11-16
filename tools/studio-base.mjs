import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function inside(relative,base=root){
  if(typeof relative!=='string'||!relative||path.isAbsolute(relative))throw Error('Cần đường dẫn tương đối trong project');
  const full=path.resolve(base,relative);
  if(!full.startsWith(base+path.sep))throw Error('Đường dẫn vượt project');
  return full;
}
export const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function shortlist(library,type,exists=fs.existsSync,hash=sha){
  return library.bases.filter(b=>b.garmentType===type&&b.status==='ready'&&exists(inside(b.file))&&hash(inside(b.file))===b.sha256&&
    ['front','back'].every(v=>b.images?.[v]&&exists(inside(b.images[v]))))
    .sort((a,b)=>(b.successfulOrders||[]).length-(a.successfulOrders||[]).length).slice(0,2);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const type=process.argv[2];
  if(!type)throw Error('node tools/studio-base.mjs <tshirt|hoodie|shirt|...>');
  const library=JSON.parse(fs.readFileSync(inside('quality/studio-bases.json'),'utf8'));
  const bases=shortlist(library,type);
  console.log(JSON.stringify({garmentType:type,ready:bases,needsPreparation:!bases.length,
    excluded:library.bases.filter(b=>b.status==='rejected').map(b=>({file:b.file,reason:b.reason})),
    next:bases.length?'Xem ảnh trước/sau, chọn phom và giữ nguyên geometry nếu brief phù hợp.':'Research xem ảnh tối đa hai nguồn; giới hạn chuẩn bị 15 phút, không chọn lại nguồn rejected.'},null,2));
}
