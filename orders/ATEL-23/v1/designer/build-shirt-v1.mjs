import fs from 'node:fs';
import crypto from 'node:crypto';
const outDir='orders/ATEL-23/v1/designer';
const mat={name:'ATEL-23 shirt_body (geometry preview only)',pbrMetallicRoughness:{baseColorFactor:[0.78,0.82,0.84,1],metallicFactor:0,roughnessFactor:.82},doubleSided:true};
const P=[],T=[],I=[];
function tri(a,b,c){I.push(a,b,c)}
function quad(a,b,c,d){tri(a,b,c);tri(a,c,d)}
function vertex(x,y,z,u=.02,v=.03){P.push(x,y,z);T.push(u,v);return P.length/3-1}
function ellipseRings(rings,axis='y',segments=48,closedEnds=false,uvRect=[.02,.03,.48,.97]){
 const [u0,v0,u1,v1]=uvRect,ids=[];for(let ri=0;ri<rings.length;ri++){const r=rings[ri],row=[];for(let j=0;j<segments;j++){const a=2*Math.PI*j/segments;let x,y,z;if(axis==='y'){x=r.cx+r.rx*Math.sin(a);y=r.p;z=r.cz+r.rz*Math.cos(a)}else{x=r.p;y=r.cy+r.ry*Math.sin(a);z=r.cz+r.rz*Math.cos(a)}const prog=axis==='y'?(r.p-rings[0].p)/(rings.at(-1).p-rings[0].p):Math.abs(r.p-rings[0].p)/(Math.abs(rings.at(-1).p)-Math.abs(rings[0].p));row.push(vertex(x,y,z,u0+(u1-u0)*j/(segments-1),v0+(v1-v0)*prog))}ids.push(row)}
 for(let q=0;q<ids.length-1;q++)for(let j=0;j<segments;j++){const n=(j+1)%segments;quad(ids[q][j],ids[q+1][j],ids[q+1][n],ids[q][n])}
 if(closedEnds){const bottom=vertex(...(axis==='y'?[rings[0].cx,rings[0].p,rings[0].cz]:[rings[0].p,rings[0].cy,rings[0].cz]));for(let j=0;j<segments;j++)tri(bottom,ids[0][(j+1)%segments],ids[0][j]);const last=rings.at(-1),top=vertex(...(axis==='y'?[last.cx,last.p,last.cz]:[last.p,last.cy,last.cz]));for(let j=0;j<segments;j++)tri(top,ids.at(-1)[j],ids.at(-1)[(j+1)%segments])}
 return ids;
}
// Shirt shell follows mannequin-v1 chest/waist/hip/neck sections with nominal 15 mm ease.
ellipseRings([
 {p:.855,cx:0,cz:-.005,rx:.188,rz:.125},
 {p:.94,cx:0,cz:-.008,rx:.190,rz:.125},
 {p:1.08,cx:0,cz:.004,rx:.177,rz:.121},
 {p:1.18,cx:0,cz:.017,rx:.157,rz:.110},
 {p:1.29,cx:0,cz:.004,rx:.177,rz:.121},
 {p:1.37,cx:0,cz:-.014,rx:.210,rz:.136},
 {p:1.415,cx:0,cz:-.030,rx:.228,rz:.134},
 {p:1.46,cx:0,cz:-.043,rx:.247,rz:.116},
 {p:1.49,cx:0,cz:-.042,rx:.247,rz:.107},
 {p:1.525,cx:0,cz:-.030,rx:.222,rz:.098},
 {p:1.555,cx:0,cz:-.012,rx:.145,rz:.091},
 {p:1.573,cx:0,cz:-.010,rx:.103,rz:.088}
],'y',64,false,[.02,.04,.48,.72]);
// Long sleeves along the T-pose arms, with clearance around measured upper-arm/elbow/wrist stations.
for(const s of [-1,1]){
 ellipseRings([
  {p:s*.145,cy:1.487,cz:-.044,ry:.072,rz:.078},
  {p:s*.175,cy:1.487,cz:-.044,ry:.076,rz:.082},
  {p:s*.205,cy:1.487,cz:-.044,ry:.078,rz:.086},
  {p:s*.270,cy:1.496,cz:-.045,ry:.075,rz:.085},
  {p:s*.340,cy:1.493,cz:-.046,ry:.057,rz:.077},
  {p:s*.430,cy:1.493,cz:-.046,ry:.055,rz:.069},
  {p:s*.530,cy:1.493,cz:-.045,ry:.060,rz:.056},
  {p:s*.630,cy:1.500,cz:-.039,ry:.049,rz:.050},
  {p:s*.710,cy:1.505,cz:-.032,ry:.038,rz:.044},
  {p:s*.742,cy:1.506,cz:-.031,ry:.038,rz:.044},
  {p:s*.790,cy:1.506,cz:-.031,ry:.040,rz:.046}
 ],'x',32,false,s>0?[.52,.04,.96,.46]:[.52,.54,.96,.96]);
 // Cuff band, subtly flared at wrist; the open inner ring avoids capping the hand.
 ellipseRings([
  {p:s*.742,cy:1.506,cz:-.031,ry:.039,rz:.045},
  {p:s*.756,cy:1.506,cz:-.031,ry:.040,rz:.046},
  {p:s*.790,cy:1.506,cz:-.031,ry:.040,rz:.046}
 ],'x',32,false,s>0?[.52,.04,.96,.46]:[.52,.54,.96,.96]);
}
// Raised collar stand and simple collar leaves as geometry only.
ellipseRings([
 {p:1.555,cx:0,cz:-.010,rx:.104,rz:.090},
 {p:1.577,cx:0,cz:-.010,rx:.105,rz:.091},
 {p:1.603,cx:0,cz:-.010,rx:.098,rz:.086}
],'y',48,false,[.02,.77,.48,.96]);
// front placket, face +Z, with a slim layered center strip; no artwork/material texture applied.
function panel(points){const row=points.map(([x,y,z])=>vertex(x,y,z,.02+(x+.15)*(.46/.30),.77+(y-.855)*(.19/.748)));for(let k=1;k<row.length-1;k++)tri(row[0],row[k],row[k+1])}
panel([[-.018,1.49,.064],[.018,1.49,.064],[.016,.86,.116],[-.016,.86,.116]]);
// Collar tips point down over chest from the open neck ring.
panel([[-.092,1.576,.055],[-.012,1.557,.083],[-.027,1.475,.124],[-.115,1.520,.078]]);
panel([[.092,1.576,.055],[.012,1.557,.083],[.027,1.475,.124],[.115,1.520,.078]]);
// Button-like geometry dots on the placket, small and neutral; independent QA may assess exact appearance.
for(let y=1.45;y>=.94;y-=.085){const cy=vertex(0,y,.119,.25,.77+(y-.855)*(.19/.748)),ring=[];for(let j=0;j<12;j++){const a=j*2*Math.PI/12;ring.push(vertex(.004*Math.cos(a),y+.004*Math.sin(a),.1195,.25,.77+(y-.855)*(.19/.748)))}for(let j=0;j<12;j++)tri(cy,ring[j],ring[(j+1)%12])}
// Compute smooth normals from faces.
const N=new Float32Array(P.length);for(let q=0;q<I.length;q+=3){const a=I[q]*3,b=I[q+1]*3,c=I[q+2]*3;const ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],vx=P[c]-P[a],vy=P[c+1]-P[a+1],vz=P[c+2]-P[a+2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;for(const k of [a,b,c]){N[k]+=nx;N[k+1]+=ny;N[k+2]+=nz}}
for(let q=0;q<N.length;q+=3){const d=Math.hypot(N[q],N[q+1],N[q+2])||1;N[q]/=d;N[q+1]/=d;N[q+2]/=d}
const max=Math.max(...I),idxType=max>65535?5125:5123,idxBytes=idxType===5125?4:2;
const posBuf=Buffer.alloc(P.length*4);P.forEach((v,i)=>posBuf.writeFloatLE(v,i*4));const normBuf=Buffer.from(N.buffer);const indexBuf=Buffer.alloc(I.length*idxBytes);I.forEach((v,i)=>idxType===5125?indexBuf.writeUInt32LE(v,i*4):indexBuf.writeUInt16LE(v,i*2));
function align(buf,fill=0){const pad=(4-buf.length%4)%4;return pad?Buffer.concat([buf,Buffer.alloc(pad,fill)]):buf}
const chunks=[align(posBuf),align(normBuf),align(indexBuf)],views=[];let offset=0;for(let i=0;i<chunks.length;i++){views.push({buffer:0,byteOffset:offset,byteLength:[posBuf,normBuf,indexBuf][i].length});offset+=chunks[i].length}const bin=Buffer.concat(chunks);
const min=[Infinity,Infinity,Infinity],maxP=[-Infinity,-Infinity,-Infinity];for(let i=0;i<P.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],P[i+k]);maxP[k]=Math.max(maxP[k],P[i+k])}
const uvBuf=Buffer.alloc(T.length*4);T.forEach((v,i)=>uvBuf.writeFloatLE(v,i*4));const uvAligned=align(uvBuf),uvView={buffer:0,byteOffset:bin.length,byteLength:uvBuf.length};const binUv=Buffer.concat([bin,uvAligned]);views.push(uvView);
const gltf={asset:{version:'2.0',generator:'AtelierX Designer · ATEL-23/v1 garment geometry',extras:{order:'ATEL-23',revision:'v1',fitReference:'mannequin-v1'}},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'ATEL-23 Shirt v1',mesh:0}],meshes:[{name:'ATEL-23 Shirt v1 geometry',primitives:[{attributes:{POSITION:0,NORMAL:1,TEXCOORD_0:3},indices:2,material:0,mode:4}]}],materials:[mat],buffers:[{byteLength:binUv.length}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:P.length/3,type:'VEC3',min,max:maxP},{bufferView:1,componentType:5126,count:N.length/3,type:'VEC3'},{bufferView:2,componentType:idxType,count:I.length,type:'SCALAR'},{bufferView:3,componentType:5126,count:T.length/2,type:'VEC2',min:[0,0],max:[1,1]}]};
const js=Buffer.from(JSON.stringify(gltf)),jp=align(js,0x20),bp=align(binUv),head=Buffer.alloc(12);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(12+8+jp.length+8+bp.length,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(jp.length,0);jh.write('JSON',4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bp.length,0);bh.write('BIN\0',4);const out=Buffer.concat([head,jh,jp,bh,bp]);fs.writeFileSync(`${outDir}/garment-v1.glb`,out);console.log(JSON.stringify({vertices:P.length/3,triangles:I.length/3,bytes:out.length,sha256:crypto.createHash('sha256').update(out).digest('hex'),bounds:{min,max:maxP}},null,2));
