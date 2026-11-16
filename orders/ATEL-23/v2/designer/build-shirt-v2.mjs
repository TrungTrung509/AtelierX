import fs from 'node:fs';
import crypto from 'node:crypto';
const outDir='orders/ATEL-23/v2/designer';
const mat={name:'ATEL-23 shirt_body (geometry preview only)',pbrMetallicRoughness:{baseColorFactor:[0.78,0.82,0.84,1],metallicFactor:0,roughnessFactor:.82},doubleSided:true};
const P=[],T=[],I=[];
function tri(a,b,c){I.push(a,b,c)}
function quad(a,b,c,d){tri(a,b,c);tri(a,c,d)}
function vertex(x,y,z,u=.02,v=.03){P.push(x,y,z);T.push(u,v);return P.length/3-1}
function ellipseRings(rings,axis='y',segments=48,closedEnds=false,uvRect=[.02,.03,.48,.97]){
 const [u0,v0,u1,v1]=uvRect,ids=[];for(let ri=0;ri<rings.length;ri++){const r=rings[ri],row=[];for(let j=0;j<segments;j++){const a=2*Math.PI*j/segments;let x,y,z;if(axis==='y'){x=r.cx+r.rx*Math.sin(a);y=r.p;const rz=Math.cos(a)>=0?(r.rzFront??r.rz):(r.rzRear??r.rz);z=r.cz+rz*Math.cos(a)}else{x=r.p;y=r.cy+r.ry*Math.sin(a);z=r.cz+r.rz*Math.cos(a);const posterior=Math.max(0,-Math.cos(a)),underarm=Math.max(0,-Math.sin(a)),blend=Math.sqrt(2*posterior*underarm);x-=Math.sign(r.p)*Math.max(0,r.underarmReach||0)*blend;y-=Math.max(0,r.underarmDrop||0)*blend;z-=Math.max(0,r.underarmDepth||0)*blend}const prog=axis==='y'?(r.p-rings[0].p)/(rings.at(-1).p-rings[0].p):Math.abs(r.p-rings[0].p)/(Math.abs(rings.at(-1).p)-Math.abs(rings[0].p));row.push(vertex(x,y,z,u0+(u1-u0)*j/(segments-1),v0+(v1-v0)*prog))}ids.push(row)}
 for(let q=0;q<ids.length-1;q++)for(let j=0;j<segments;j++){const n=(j+1)%segments;quad(ids[q][j],ids[q+1][j],ids[q+1][n],ids[q][n])}
 if(closedEnds){const bottom=vertex(...(axis==='y'?[rings[0].cx,rings[0].p,rings[0].cz]:[rings[0].p,rings[0].cy,rings[0].cz]));for(let j=0;j<segments;j++)tri(bottom,ids[0][(j+1)%segments],ids[0][j]);const last=rings.at(-1),top=vertex(...(axis==='y'?[last.cx,last.p,last.cz]:[last.p,last.cy,last.cz]));for(let j=0;j<segments;j++)tri(top,ids.at(-1)[j],ids.at(-1)[(j+1)%segments])}
 return ids;
}
// Pattern boundary reference: Christina M. Hein, ChristinaHein/shirt (MIT), commit 7c0c47ada21ba59eede853bc022a059412befe0c.
// Ported/derived boundary logic is documented in references/PATTERN-SOURCE-NOTICE.md; the MIT notice is bundled beside it.
// Loft profiles are measured from frozen v1 and mannequin-v1 with nominal ease.
const torsoRings=[
 {p:.855,cx:0,cz:-.005,rx:.188,rz:.125},
 {p:.94,cx:0,cz:-.008,rx:.190,rz:.125},
 {p:1.08,cx:0,cz:.004,rx:.177,rz:.121},
 {p:1.18,cx:0,cz:.017,rx:.157,rz:.110},
 {p:1.29,cx:0,cz:.004,rx:.177,rz:.121},
 {p:1.37,cx:0,cz:-.014,rx:.210,rz:.136,rzRear:.150},
 {p:1.415,cx:0,cz:-.030,rx:.265,rz:.134,rzRear:.180},
 {p:1.46,cx:0,cz:-.043,rx:.265,rz:.116,rzRear:.165},
 {p:1.49,cx:0,cz:-.042,rx:.247,rz:.107,rzRear:.145},
 {p:1.525,cx:0,cz:-.030,rx:.222,rz:.098,rzRear:.118},
 {p:1.555,cx:0,cz:-.012,rx:.145,rz:.091},
 {p:1.573,cx:0,cz:-.010,rx:.103,rz:.088}
];
const sleeveRings=[
 {p:.145,cy:1.487,cz:-.044,ry:.072,rz:.078},
 {p:.175,cy:1.487,cz:-.044,ry:.076,rz:.082},
 {p:.205,cy:1.487,cz:-.044,ry:.078,rz:.086},
 {p:.270,cy:1.496,cz:-.045,ry:.075,rz:.085},
 {p:.340,cy:1.493,cz:-.046,ry:.057,rz:.077},
 {p:.430,cy:1.493,cz:-.046,ry:.055,rz:.069},
 {p:.530,cy:1.493,cz:-.045,ry:.060,rz:.056},
 {p:.630,cy:1.500,cz:-.039,ry:.049,rz:.050},
 {p:.710,cy:1.505,cz:-.032,ry:.038,rz:.044},
 {p:.742,cy:1.506,cz:-.031,ry:.038,rz:.044}
];
function interp(rows,p,key){let i=0;while(i<rows.length-2&&p>rows[i+1].p)i++;const a=rows[i],b=rows[i+1],t=Math.max(0,Math.min(1,(p-a.p)/(b.p-a.p)));return a[key]+(b[key]-a[key])*t}
// Port of the source's 3-point armhole Bezier construction, evaluated with mannequin-v1 measurements.
function sampleQuadratic(p0,p1,p2,n=30){const pts=[];for(let i=0;i<=n;i++){const t=i/n,u=1-t;pts.push([u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]])}return pts}
function polylineLength(pts){let n=0;for(let i=1;i<pts.length;i++)n+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return n}
const patternDims={chest:105.0806,waist:76.2314,hip:91.5205,backLength:39,seatLength:24,rearShoulder:50,fitAllowance:.0125};
let am=patternDims.chest/24+1;if(patternDims.chest<=89)am-=.5;else if(patternDims.chest<=99)am-=.3;else if(patternDims.chest<=109)am-=.17;else if(patternDims.chest>=120)am+=.17;
const cmSb=2,cmSf=3,cmCuffWidth=1,a1=[0,patternDims.chest*(1+patternDims.fitAllowance)/4],a3=[0,patternDims.rearShoulder/2],b3=[0,a1[1]+10],B=[0,b3[1]+patternDims.chest*(1+patternDims.fitAllowance)/4],b2=[0,B[1]-patternDims.backLength/2],x1=[-patternDims.backLength/2,0],x2=[x1[0],b3[1]],x3=[x1[0],a1[1]],y=[-patternDims.backLength/4,B[1]],y1=[-patternDims.backLength/4,0];
const y2=[y[0],b2[1]+(2*am-(b2[1]-b3[1]))/(patternDims.backLength/2-cmSb)*(patternDims.backLength/4-cmSb)];
const y3=[y1[0],a3[1]-(1.5*am-(a1[1]-a3[1]))/(patternDims.backLength/2-cmSf)*(patternDims.backLength/4-cmSf)];
const backArmhole2d=sampleQuadratic(y2,[x1[0],b2[1]-Math.abs(b2[1]-y2[1])*(Math.abs(x1[0])+cmSb)/y1[0]],x2),frontArmhole2d=sampleQuadratic(y3,[x1[0],a3[1]+Math.abs(a3[1]-y3[1])*(Math.abs(x1[0])+cmSf)/y1[0]],x3);
const patternArmholeLengthsMeters={front:polylineLength([[0,a3[1]-cmSf],...frontArmhole2d])/100,back:polylineLength([[0,b2[1]+cmSb],...backArmhole2d])/100},patternBlendMeters=Math.max(.032,Math.min(.050,(patternArmholeLengthsMeters.front+patternArmholeLengthsMeters.back)*.10));
function interpOptional(rows,p,key,fallback){let i=0;while(i<rows.length-2&&p>rows[i+1].p)i++;const a=rows[i],b=rows[i+1],t=Math.max(0,Math.min(1,(p-a.p)/(b.p-a.p))),av=a[key]??a[fallback],bv=b[key]??b[fallback];return av+(bv-av)*t}
function bodyDistance(x,y,z){const r={};for(const k of ['cx','cz','rx','rz'])r[k]=interp(torsoRings,y,k);const rearRz=interpOptional(torsoRings,y,'rzRear','rz'),rz=z<r.cz?rearRz:r.rz,q=Math.hypot((x-r.cx)/r.rx,(z-r.cz)/rz);return(q-1)*Math.min(r.rx,rz)}
function sleeveDistance(x,y,z){const p=Math.abs(x),r={};for(const k of ['cy','cz','ry','rz'])r[k]=interp(sleeveRings,p,k);const capEase=Math.max(0,Math.min(1,(.43-p)/(.43-.145)))*patternBlendMeters,ry=r.ry+capEase*1.5,rz=r.rz+capEase*1.5,cy=r.cy-capEase*.35,q=Math.hypot((y-cy)/ry,(z-r.cz)/rz),radial=(q-1)*Math.min(r.ry,r.rz);return radial}
function smoothMin(a,b,k=patternBlendMeters){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25}
// One implicit outer garment shell: torso and both sleeve lofts are unioned into a continuous armhole junction.
function addPatternJunctionSurface(){
 const bounds={x0:-.742,x1:.742,y0:.855,y1:1.573,z0:-.30,z1:.18},step=.008;
 const nx=Math.ceil((bounds.x1-bounds.x0)/step)+1,ny=Math.ceil((bounds.y1-bounds.y0)/step)+1,nz=Math.ceil((bounds.z1-bounds.z0)/step)+1;
 const dx=(bounds.x1-bounds.x0)/(nx-1),dy=(bounds.y1-bounds.y0)/(ny-1),dz=(bounds.z1-bounds.z0)/(nz-1),values=new Float32Array(nx*ny*nz);
 const id=(i,j,k)=>(i*ny+j)*nz+k,point=(n)=>{const k=n%nz,j=Math.floor(n/nz)%ny,i=Math.floor(n/(ny*nz));return[bounds.x0+i*dx,bounds.y0+j*dy,bounds.z0+k*dz]};
 for(let i=0;i<nx;i++){const x=bounds.x0+i*dx;for(let j=0;j<ny;j++){const y=bounds.y0+j*dy;for(let k=0;k<nz;k++){const z=bounds.z0+k*dz,d=bodyDistance(x,y,z),a=sleeveDistance(x,y,z),b=sleeveDistance(-x,y,z);values[id(i,j,k)]=smoothMin(smoothMin(d,a),b)}}}
 const edgeMap=new Map(),cube=[ [0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1] ],tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 function edgeVertex(na,nb){const lo=Math.min(na,nb),hi=Math.max(na,nb),key=`${lo}:${hi}`,found=edgeMap.get(key);if(found!==undefined)return found;const da=values[na],db=values[nb],t=Math.max(0,Math.min(1,da/(da-db))),pa=point(na),pb=point(nb),v=[pa[0]+(pb[0]-pa[0])*t,pa[1]+(pb[1]-pa[1])*t,pa[2]+(pb[2]-pa[2])*t];const body=Math.abs(bodyDistance(...v)),sleeve=Math.abs(sleeveDistance(...v));let uv;if(sleeve<body&&Math.abs(v[0])>.20){const p=Math.abs(v[0]),r={};for(const k of ['cy','cz','ry','rz'])r[k]=interp(sleeveRings,p,k);let a=Math.atan2((v[1]-r.cy)/r.ry,(v[2]-r.cz)/r.rz);if(a<0)a+=2*Math.PI;const prog=Math.max(0,Math.min(1,(p-.145)/(.742-.145)));uv=[.52+.44*a/(2*Math.PI),v[0]>0?.04+.42*prog:.54+.42*prog]}else{const r={};for(const k of ['cx','cz','rx','rz'])r[k]=interp(torsoRings,v[1],k);let a=Math.atan2((v[0]-r.cx)/r.rx,(v[2]-r.cz)/r.rz);if(a<0)a+=2*Math.PI;const prog=Math.max(0,Math.min(1,(v[1]-.855)/(1.573-.855)));uv=[.02+.46*a/(2*Math.PI),.04+.68*prog]}const n=vertex(...v,...uv);edgeMap.set(key,n);return n}
 function emit(ids,inside,outside){const a=ids[0],b=ids[1],c=ids[2],pa=[P[a*3],P[a*3+1],P[a*3+2]],pb=[P[b*3],P[b*3+1],P[b*3+2]],pc=[P[c*3],P[c*3+1],P[c*3+2]],inC=[0,0,0],outC=[0,0,0];for(const n of inside){const p=point(n);for(let q=0;q<3;q++)inC[q]+=p[q]/inside.length}for(const n of outside){const p=point(n);for(let q=0;q<3;q++)outC[q]+=p[q]/outside.length}const ux=pb[0]-pa[0],uy=pb[1]-pa[1],uz=pb[2]-pa[2],vx=pc[0]-pa[0],vy=pc[1]-pa[1],vz=pc[2]-pa[2],normal=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx],out=[outC[0]-inC[0],outC[1]-inC[1],outC[2]-inC[2]];if(normal[0]*out[0]+normal[1]*out[1]+normal[2]*out[2]<0)tri(a,c,b);else tri(a,b,c)}
 for(let i=0;i<nx-1;i++)for(let j=0;j<ny-1;j++)for(let k=0;k<nz-1;k++){const ids=cube.map(([a,b,c])=>id(i+a,j+b,k+c)),ds=ids.map(n=>values[n]),min=Math.min(...ds),max=Math.max(...ds);if(min>=0||max<0)continue;for(const tt of tets){const ins=[],outs=[];for(const q of tt)(values[ids[q]]<0?ins:outs).push(ids[q]);if(!ins.length||!outs.length)continue;if(ins.length===1){emit([edgeVertex(ins[0],outs[0]),edgeVertex(ins[0],outs[1]),edgeVertex(ins[0],outs[2])],ins,outs)}else if(ins.length===3){emit([edgeVertex(outs[0],ins[0]),edgeVertex(outs[0],ins[1]),edgeVertex(outs[0],ins[2])],ins,outs)}else{const a=edgeVertex(ins[0],outs[0]),b=edgeVertex(ins[0],outs[1]),c=edgeVertex(ins[1],outs[0]),d=edgeVertex(ins[1],outs[1]);emit([a,b,c],ins,outs);emit([b,d,c],ins,outs)}}}
 console.log(JSON.stringify({junctionMethod:'implicit union from mannequin-measured lofts and ported shirt armhole Bézier boundaries',referenceArmholeLengthsMeters:patternArmholeLengthsMeters,smoothUnionRadiusMeters:patternBlendMeters,grid:[nx,ny,nz],vertices:P.length/3,triangles:I.length/3}));
}
addPatternJunctionSurface();
// Open cuff rings continue the implicit sleeve shell without capping the mannequin hands.
for(const s of [-1,1]){
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
let maxIndex=0;for(const n of I)if(n>maxIndex)maxIndex=n;const idxType=maxIndex>65535?5125:5123,idxBytes=idxType===5125?4:2;
const posBuf=Buffer.alloc(P.length*4);P.forEach((v,i)=>posBuf.writeFloatLE(v,i*4));const normBuf=Buffer.from(N.buffer);const indexBuf=Buffer.alloc(I.length*idxBytes);I.forEach((v,i)=>idxType===5125?indexBuf.writeUInt32LE(v,i*4):indexBuf.writeUInt16LE(v,i*2));
function align(buf,fill=0){const pad=(4-buf.length%4)%4;return pad?Buffer.concat([buf,Buffer.alloc(pad,fill)]):buf}
const chunks=[align(posBuf),align(normBuf),align(indexBuf)],views=[];let offset=0;for(let i=0;i<chunks.length;i++){views.push({buffer:0,byteOffset:offset,byteLength:[posBuf,normBuf,indexBuf][i].length});offset+=chunks[i].length}const bin=Buffer.concat(chunks);
const min=[Infinity,Infinity,Infinity],maxP=[-Infinity,-Infinity,-Infinity];for(let i=0;i<P.length;i+=3)for(let k=0;k<3;k++){min[k]=Math.min(min[k],P[i+k]);maxP[k]=Math.max(maxP[k],P[i+k])}
const uvBuf=Buffer.alloc(T.length*4);T.forEach((v,i)=>uvBuf.writeFloatLE(v,i*4));const uvAligned=align(uvBuf),uvView={buffer:0,byteOffset:bin.length,byteLength:uvBuf.length};const binUv=Buffer.concat([bin,uvAligned]);views.push(uvView);
const gltf={asset:{version:'2.0',generator:'AtelierX Designer · ATEL-23/v2 stitched armhole topology',extras:{order:'ATEL-23',revision:'v2',fitReference:'mannequin-v1',derivedFromRevision:'v1',derivedFromSha256:'87d6d1f1fa98bae641df5578b634ca08a9453026586e314e2ba7d13e59a0c3bd',changeScope:'continuous implicit union of torso and sleeve-root shells; UV0 regenerated using original torso/sleeve atlas regions',patternBoundaryReference:{repository:'https://github.com/ChristinaHein/shirt',revision:'7c0c47ada21ba59eede853bc022a059412befe0c',license:'MIT',notice:'orders/ATEL-23/v2/designer/references/PATTERN-SOURCE-NOTICE.md'}}},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'ATEL-23 Shirt v2',mesh:0}],meshes:[{name:'ATEL-23 Shirt v2 continuous junction geometry',primitives:[{attributes:{POSITION:0,NORMAL:1,TEXCOORD_0:3},indices:2,material:0,mode:4}]}],materials:[mat],buffers:[{byteLength:binUv.length}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:P.length/3,type:'VEC3',min,max:maxP},{bufferView:1,componentType:5126,count:N.length/3,type:'VEC3'},{bufferView:2,componentType:idxType,count:I.length,type:'SCALAR'},{bufferView:3,componentType:5126,count:T.length/2,type:'VEC2',min:[0,0],max:[1,1]}]};
const js=Buffer.from(JSON.stringify(gltf)),jp=align(js,0x20),bp=align(binUv),head=Buffer.alloc(12);head.write('glTF');head.writeUInt32LE(2,4);head.writeUInt32LE(12+8+jp.length+8+bp.length,8);const jh=Buffer.alloc(8);jh.writeUInt32LE(jp.length,0);jh.write('JSON',4);const bh=Buffer.alloc(8);bh.writeUInt32LE(bp.length,0);bh.write('BIN\0',4);const out=Buffer.concat([head,jh,jp,bh,bp]);fs.writeFileSync(`${outDir}/garment-v2.glb`,out);console.log(JSON.stringify({vertices:P.length/3,triangles:I.length/3,bytes:out.length,sha256:crypto.createHash('sha256').update(out).digest('hex'),bounds:{min,max:maxP}},null,2));
