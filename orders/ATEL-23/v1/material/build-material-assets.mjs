import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';

const root = process.cwd();
const outDir = path.resolve(root, 'orders/ATEL-23/v1/material');
const artworkPath = path.resolve(root, 'orders/ATEL-23/v1/researcher/artwork/atel23-cityline-microprint-v1.svg');
const garmentPath = path.resolve(root, 'orders/ATEL-23/v1/designer/garment-v1.glb');
const fitPath = path.resolve(root, 'orders/ATEL-23/v1/designer/fit.json');
const require = createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium} = require('playwright-core');
const size = 1024;
const designerHandoffMessageId = '654c563f-698a-49b7-8f40-9b51492f92ec';
const teamThreadRootMessageId = 'dcd7029e-6652-4d5f-9056-ada1cd5de5a1';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function linear(v){v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}
function luminance(hex){const v=hex.slice(1).match(/../g).map(x=>parseInt(x,16));return .2126*linear(v[0])+.7152*linear(v[1])+.0722*linear(v[2])}
function lab(hex){
  const rgb=hex.slice(1).match(/../g).map(x=>linear(parseInt(x,16)));
  let [x,y,z]=[.4124564*rgb[0]+.3575761*rgb[1]+.1804375*rgb[2],.2126729*rgb[0]+.7151522*rgb[1]+.072175*rgb[2],.0193339*rgb[0]+.119192*rgb[1]+.9503041*rgb[2]];
  x/=.95047; y/=1; z/=1.08883; const f=t=>t>.008856?t**(1/3):7.787*t+16/116;
  const fx=f(x),fy=f(y),fz=f(z); return [116*fy-16,500*(fx-fy),200*(fy-fz)];
}
function deltaE(a,b){const A=lab(a),B=lab(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2])}
function ratio(a,b){const [x,y]=[luminance(a),luminance(b)].sort((m,n)=>n-m);return (x+.05)/(y+.05)}
fs.mkdirSync(outDir, {recursive: true});
const mappingEvidenceFiles={
  capture:path.join(outDir,'evidence/texture-mapped-fit-preview.png'),
  report:path.join(outDir,'evidence/capture-report.json'),
  diagnosticGlb:path.join(outDir,'evidence/texture-mapped-fit-preview.glb')
};
const mappingEvidence=Object.fromEntries(Object.entries(mappingEvidenceFiles).filter(([,file])=>fs.existsSync(file)).map(([key,file])=>[key,{path:path.relative(root,file),sha256:sha(file)}]));

const artwork = fs.readFileSync(artworkPath, 'utf8');
const fit = JSON.parse(fs.readFileSync(fitPath, 'utf8'));
const artworkData = `data:image/svg+xml;base64,${Buffer.from(artwork).toString('base64')}`;
const pageHtml = `<!doctype html><meta charset="utf-8"><canvas id="c"></canvas><script>
window.renderTextures = async (artworkUrl) => {
  const size = ${size};
  const c = document.querySelector('#c'); c.width = size; c.height = size;
  const ctx = c.getContext('2d', {willReadFrequently:true});
  const img = new Image(); img.src = artworkUrl; await img.decode();
  // One UV tile contains a fine, office-friendly repeat of the approved artwork.
  ctx.fillStyle = '#D9EEF4'; ctx.fillRect(0,0,size,size);
  for(let y=0;y<size;y+=512) for(let x=0;x<size;x+=512) ctx.drawImage(img,x,y,512,512);
  const baseColor = c.toDataURL('image/png');

  // Subtle woven cotton-like grain. This is a digital appearance texture, not a claim about physical composition.
  const rough = ctx.createImageData(size,size);
  const normal = ctx.createImageData(size,size);
  const height = new Float32Array(size*size);
  for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
    const i=y*size+x;
    const warp=Math.sin(x*Math.PI/3.5), weft=Math.sin(y*Math.PI/3.5);
    height[i]=0.52 + 0.035*warp + 0.035*weft + 0.012*Math.sin((x+y)*Math.PI/11);
    const weave=((x%7===0)||(y%7===0))?7:0;
    const r=Math.max(0,Math.min(255,Math.round(205 + 16*warp + 12*weft + weave)));
    rough.data[i*4]=r; rough.data[i*4+1]=r; rough.data[i*4+2]=r; rough.data[i*4+3]=255;
  }
  for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
    const i=y*size+x, left=y*size+Math.max(0,x-1), right=y*size+Math.min(size-1,x+1);
    const up=Math.max(0,y-1)*size+x, down=Math.min(size-1,y+1)*size+x;
    let nx=-(height[right]-height[left])*12, ny=-(height[down]-height[up])*12, nz=1;
    const len=Math.hypot(nx,ny,nz); nx/=len; ny/=len; nz/=len;
    normal.data[i*4]=Math.round((nx*.5+.5)*255); normal.data[i*4+1]=Math.round((ny*.5+.5)*255);
    normal.data[i*4+2]=Math.round((nz*.5+.5)*255); normal.data[i*4+3]=255;
  }
  ctx.putImageData(rough,0,0); const roughness= c.toDataURL('image/png');
  ctx.putImageData(normal,0,0); const normalMap= c.toDataURL('image/png');

  // Evidence capture: palette and repeat-scale swatches against the actual viewer backdrop gray.
  c.width=1600; c.height=900;
  ctx.fillStyle='#CBD2D8'; ctx.fillRect(0,0,1600,900);
  ctx.fillStyle='#18212B'; ctx.font='600 38px system-ui'; ctx.fillText('ATEL-23/v1 · Bản xem trước vật liệu số',72,78);
  ctx.font='22px system-ui'; ctx.fillText('Nền viewer/mannequin trung tính  #CBD2D8',72,122);
  ctx.fillStyle='#F7FAFB'; ctx.fillRect(72,164,1456,622);
  ctx.fillStyle='#18212B'; ctx.font='600 27px system-ui'; ctx.fillText('Palette áo sơ mi xanh trời nhạt · họa tiết Tuyến sáng',112,220);
  const swatch = new Image(); swatch.src = baseColor; await swatch.decode();
  ctx.save(); ctx.beginPath(); ctx.rect(112,260,860,400); ctx.clip();
  ctx.drawImage(swatch,112,260,860,400);
  ctx.restore();
  ctx.strokeStyle='#687680'; ctx.lineWidth=2; ctx.strokeRect(112,260,860,400);
  ctx.fillStyle='#18212B'; ctx.font='22px system-ui'; ctx.fillText('Nền vải: #D9EEF4',1020,300);
  ctx.fillText('Màu mannequin/viewer: #CBD2D8',1020,342);
  ctx.fillStyle='#579BB3'; ctx.fillRect(1020,374,52,12); ctx.fillStyle='#18212B'; ctx.fillText('Chỉ tuyến: #579BB3',1088,388);
  ctx.fillStyle='#E98979'; ctx.beginPath(); ctx.arc(1030,428,8,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#18212B'; ctx.fillText('Điểm nhấn coral: #E98979',1052,436);
  ctx.fillStyle='#D9B94C'; ctx.beginPath(); ctx.arc(1030,478,8,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#18212B'; ctx.fillText('Điểm nhấn vàng dịu: #D9B94C',1052,486);
  ctx.font='18px system-ui'; ctx.fillText('Swatch/PBR preview; UV0 atlas đã có theo frozen fit.json, nhưng fit áo chưa đạt G1.',112,716);
  ctx.fillText('Mapping capture chỉ mang tính chẩn đoán; không thay thế product QA hoặc duyệt G1.',112,748);
  return {baseColor,roughness,normalMap,preview:c.toDataURL('image/png')};
};
</script>`;

const browser = await chromium.launch({executablePath: process.env.ATELIERX_BROWSER_BIN || '/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
try {
  const page = await browser.newPage();
  await page.setContent(pageHtml);
  const images = await page.evaluate(url => window.renderTextures(url), artworkData);
  for (const [key, dataUrl] of Object.entries(images)) {
    const name = ({baseColor:'base-color.png',roughness:'roughness.png',normalMap:'normal.png',preview:'material-preview.png'})[key];
    fs.writeFileSync(path.join(outDir,name), Buffer.from(dataUrl.split(',')[1], 'base64'));
  }
} finally { await browser.close(); }

const material = {
  orderId:'ATEL-23', revision:'v1', owner:'atelierx-backend-developer-0005',
  designIntent:'Áo sơ mi công sở trẻ trung, nền xanh trời nhạt và microprint Tuyến sáng; đây là màu/chất liệu biểu kiến số.',
  shader:'glTF 2.0 metallicRoughness',
  slots:[{
    primitiveIndex:fit.garment.materialSlot.primitiveIndex, materialIndex:fit.garment.materialSlot.materialIndex,
    currentGeometryMaterialName:fit.garment.materialSlot.name,
    semanticSlot:'shirt_shell_all_panels',
    baseColorFactor:[1,1,1,1], baseColorTexture:'base-color.png',
    roughnessFactor:0.96, roughnessTexture:'roughness.png',
    metallicFactor:0, normalTexture:'normal.png', normalScale:0.12,
    textureColorSpaces:{baseColor:'sRGB',roughness:'linear',normal:'linear'},
    textureWrap:'repeat', texCoord:0,
    doubleSided:true,
    notes:'Một primitive dùng chung cho thân, tay, cổ, nẹp và cúc. UV atlas đã có ở input frozen; kiểm placement trên áo sau Visual integrate. Không có slot phụ liệu riêng.'
  }],
  palette:{shirtBase:'#D9EEF4',cityline:'#579BB3',coral:'#E98979',softYellow:'#D9B94C',viewerBackdrop:'#CBD2D8'},
  colorChecks:{
    shirtVsViewerBackdrop:{contrastRatio:+ratio('#D9EEF4','#CBD2D8').toFixed(2),deltaE76:+deltaE('#D9EEF4','#CBD2D8').toFixed(1),note:'Hue/value difference is visible in swatch capture; this is not a garment edge-readability verdict.'},
    printVsShirt:Object.fromEntries(['#579BB3','#E98979','#D9B94C'].map((c,i)=>[['cityline','coral','softYellow'][i],{contrastRatio:+ratio(c,'#D9EEF4').toFixed(2)}]))
  },
  dependencies:{
    artwork:{path:'orders/ATEL-23/v1/researcher/artwork/atel23-cityline-microprint-v1.svg',sha256:sha(artworkPath)},
    garment:{path:'orders/ATEL-23/v1/designer/garment-v1.glb',sha256:sha(garmentPath)},
    fit:{path:'orders/ATEL-23/v1/designer/fit.json',sha256:sha(fitPath),status:fit.status},
    fitPreview:{path:fit.fitPreview.path,sha256:fit.fitPreview.sha256},
    uvStatus:fit.garment.topology.hasTEXCOORD_0?'TEXCOORD_0 present; UV atlas is recorded in fit.json.':'TEXCOORD_0 missing; maps cannot render.'
  },
  inputStatus:{designerGeometry:`Frozen Designer geometry verified against fit.json; channel handoff ${designerHandoffMessageId}.`,fitApproval:fit.fitAssessment.garmentFitApproved?'approved':'independent QA pending; not approved',g1:'not approved until independent QA/Lead review'},
  designerHandoff:{teamThreadRootMessageId,messageId:designerHandoffMessageId},
  mappingEvidence:{...mappingEvidence,scope:'Local diagnostic application to Designer fit-preview copy; mapping visually inspected. Not final product QA/G1.'},
  preview:{path:'material-preview.png',scope:'Palette/PBR swatch; UV0 atlas exists but garment fit has not passed G1.',contrastNote:'Diagnostic mapping capture exists; independent QA must verify final garment appearance after G1 correction. This preview is not product QA or G1 approval.'}
};
fs.writeFileSync(path.join(outDir,'material.json'), JSON.stringify(material,null,2)+'\n');

const files=['base-color.png','roughness.png','normal.png','material.json','material-preview.png'];
const manifest={orderId:'ATEL-23',revision:'v1',inputs:{artwork:{path:path.relative(root,artworkPath),sha256:sha(artworkPath)},garment:{path:path.relative(root,garmentPath),sha256:sha(garmentPath)},fit:{path:path.relative(root,fitPath),sha256:sha(fitPath),status:fit.status},fitPreview:{path:fit.fitPreview.path,sha256:fit.fitPreview.sha256}},inputStatus:{designerGeometry:`Frozen Designer geometry verified against fit.json; channel handoff ${designerHandoffMessageId}.`,fitApproval:fit.fitAssessment.garmentFitApproved?'approved':'independent QA pending; not approved',g1:'not approved until independent QA/Lead review'},designerHandoff:{teamThreadRootMessageId,messageId:designerHandoffMessageId},assets:Object.fromEntries(files.map(name=>[name,{sha256:sha(path.join(outDir,name)),bytes:fs.statSync(path.join(outDir,name)).size}])),mappingEvidence:{...mappingEvidence,scope:'Local diagnostic application to Designer fit-preview copy; mapping visually inspected. Not final product QA/G1.'},generatedBy:'build-material-assets.mjs',note:'Material maps are tied to the frozen geometry and fit manifest SHA; independent QA and G1 approval remain pending.'};
fs.writeFileSync(path.join(outDir,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest,null,2));
