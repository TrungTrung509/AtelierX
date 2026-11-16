import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const m=JSON.parse(fs.readFileSync(path.join(root,'quality/evidence/mannequin-v1/measurements.json')));
const anchors={floor:[0,0,0],crown:[0,1.8,0]};
anchors.positiveX_underarmApprox=[0.22,1.41,-0.03];
anchors.negativeX_underarmApprox=[-0.22,1.41,-0.03];
for(const [name,s] of Object.entries(m.torsoStations)) {
  anchors[name+'Center']=[(s.xmin+s.xmax)/2,s.y,(s.zmin+s.zmax)/2];
  anchors[name+'Front']=[0,s.y,s.zmax];anchors[name+'Back']=[0,s.y,s.zmin];
}
for(const [name,s] of Object.entries(m.armStations)) anchors[name]=[s.x,s.yCenter,s.zCenter];
const base={id:'atelierx-mannequin-180cm-v1',status:'measured-reference',file:'quality/candidates/mannequin/mannequin-180cm-v1.glb',sha256:m.normalizedSha256,sourceFile:'quality/candidates/mannequin/mannequin-model-v1.glb',sourceSha256:m.sourceSha256,source:'https://sketchfab.com/3d-models/mannequin--model-59460931b9cb43f98c97991300c920fb',author:'zveoxic',license:'CC-BY-4.0',units:'meters',heightConvention:'Studio reference height chosen as 1.80 m; original real-world scale is unspecified.',coordinateSystem:{up:'+Y',front:'+Z',horizontal:'+X',floorY:0,pose:'T-pose, static, no skeleton',positiveX:'use coordinate names; do not infer anatomical left/right'},worldTransform:{scale:[1,1,1],translation:[0,0,0],rotation:[0,0,0,1]},sourceToNormalized:{uniformScale:m.scale,translation:m.translation,after:'all source node world transforms'},boundsMeters:m.boundsMeters,measurements:m.torsoStations,armStations:m.armStations,anchors,anchorAccuracy:'Approximate anatomical stations chosen on inspected mesh. Arm points are section centers, not skeletal joints. Circumferences are mesh section lengths, not tailoring measurements.',evidence:Object.fromEntries(['front','back','left','right','detail','mobile'].map(k=>[k,`quality/evidence/mannequin-v1/browser/${k}.png`])),browserReport:'quality/evidence/mannequin-v1/browser/browser-result.json',fitPolicy:{garmentFitApproved:false,rule:'Reference is measured and visually inspected. Each garment must pass independent fit QA; no automatic approved pair.',recommendedInitialClearanceMeters:{body:0.015,sleeve:0.015},clearanceNote:'Starting allowance only; adjust to garment style and check intersections in 3D. Do not simply inflate all axes.',poseRule:'Fit garment to this T-pose or deliberately create a new measured pose revision. Never hide intersections with camera.'}};
fs.writeFileSync(path.join(root,'quality/mannequin-fit.json'),JSON.stringify(base,null,2)+'\n');
const templateFile=path.join(root,'quality/delivery-template.json');const t=JSON.parse(fs.readFileSync(templateFile));t.display.mannequinFile=base.file;t.display.mannequinSha256=base.sha256;fs.writeFileSync(templateFile,JSON.stringify(t,null,2)+'\n');
console.log('Profile saved:',base.id,base.status);
