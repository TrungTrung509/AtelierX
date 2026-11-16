import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {writeGlb} from '../../../../tools/showcase-glb.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const out='orders/ATEL-41/v3/designer/garment-gray-authored-v3.glb';
const P=[],N=[],UV=[],I=[];
function vertex(p,n,uv){const l=Math.hypot(...n)||1;P.push(...p);N.push(...n.map(v=>v/l));UV.push(...uv);return P.length/3-1;}
function tri(a,b,c){I.push(a,b,c)}
function grid(rows,cols,point,normal){const ids=[];for(let r=0;r<=rows;r++){ids[r]=[];for(let c=0;c<=cols;c++){const u=c/cols,v=r/rows;ids[r][c]=vertex(point(u,v),normal(u,v),[u,1-v]);}}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=ids[r][c],b=ids[r][c+1],cc=ids[r+1][c],d=ids[r+1][c+1];tri(a,cc,b);tri(b,cc,d);}return ids;}
const ellipse=(rx,rz)=>[rx,rz];
function tubeSurface(name,ys,shape,segments=64,phase=0){
  grid(ys.length-1,segments,(u,v)=>{
    const ri=Math.min(ys.length-2,Math.floor(v*(ys.length-1))),f=v*(ys.length-1)-ri,y=ys[ri]+(ys[ri+1]-ys[ri])*f;
    const [cx,rx,rz,fold]=shape(y),a=u*2*Math.PI, wave=Math.sin(a*8+y*63+phase)*fold+Math.sin(a*3-y*41+phase)*fold*.32;
    return [cx+(rx+wave)*Math.cos(a),y, (rz+wave*.72)*Math.sin(a)];
  },(u,v)=>{const a=u*2*Math.PI;return [Math.cos(a),0.12,Math.sin(a)];});
}
function interpolate(y,table){if(y<=table[0][0])return table[0].slice(1);for(let i=0;i<table.length-1;i++)if(y<=table[i+1][0]){const t=(y-table[i][0])/(table[i+1][0]-table[i][0]);return table[i].slice(1).map((v,k)=>v+(table[i+1][k+1]-v)*t);}return table.at(-1).slice(1);}
const hipTable=[[.58,0,.075,.08,.001],[.65,0,.09,.087,.001],[.72,0,.122,.096,.003],[.82,0,.165,.106,.005],[.93,0,.174,.105,.002],[1.025,0,.162,.104,.002],[1.075,0,.158,.102,.001]];
const hip=(y)=>interpolate(y,hipTable);
const foldAt=y=>.0002+.0012*Math.exp(-(((y-.07)/.045)**2))+.0010*Math.exp(-(((y-.26)/.055)**2))+.0015*Math.exp(-(((y-.48)/.05)**2))+.0011*Math.exp(-(((y-.68)/.045)**2));
function smoothMin(a,b,k=.035){const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;}
function roundedCap(radial,vertical){const outside=Math.hypot(Math.max(radial,0),Math.max(vertical,0));return outside+Math.min(Math.max(radial,vertical),0);}
function radialDistance(x,z,cx,rx,rz,y,phase=0){
  const dx=x-cx,nx=dx/rx,nz=z/rz,angle=Math.atan2(nz,nx),fold=foldAt(y),wave=fold*(Math.sin(y*45+.55*Math.sin(angle*2+phase))+.2*Math.sin(y*86+angle*.7+phase));
  return (Math.hypot(nx,nz)-1)*Math.min(rx,rz)-wave;
}
function bodySdf(x,y,z){
  const t=Math.max(0,Math.min(1,(y-.015)/.735));let pants=Infinity;
  for(const side of [-1,1]){const cx=side*(.145-.005*t),rx=.119-.01*t+.006*Math.sin(y*21),rz=.103-.004*t+.004*Math.sin(y*18);const radial=radialDistance(x,z,cx,rx,rz,y,side*.7),cap=Math.max(.015-y,y-.78);pants=Math.min(pants,roundedCap(radial,cap));}
  const [cx,rx,rz]=hip(y),upper=roundedCap(radialDistance(x,z,cx,rx,rz,y,.4),Math.max(.58-y,y-1.075));
  return smoothMin(pants,upper,.09);
}
// March one watertight pants volume from the joined leg/seat field. The two
// legs and hip form one continuous surface instead of three overlapping shells.
function emitJoinedBody(){
  const min=[-.31,-.015,-.15],step=[.01,.01,.01],size=[63,111,31],[nx,ny,nz]=size;
  const field=new Float32Array(nx*ny*nz),at=(i,j,k)=>i*ny*nz+j*nz+k,coord=(i,j,k)=>[min[0]+i*step[0],min[1]+j*step[1],min[2]+k*step[2]];
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++){const [x,y,z]=coord(i,j,k);field[at(i,j,k)]=bodySdf(x,y,z);}
  const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]],edges=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  const emitTri=pts=>{const ids=pts.map(p=>{const e=.0015,g=[bodySdf(p[0]+e,p[1],p[2])-bodySdf(p[0]-e,p[1],p[2]),bodySdf(p[0],p[1]+e,p[2])-bodySdf(p[0],p[1]-e,p[2]),bodySdf(p[0],p[1],p[2]+e)-bodySdf(p[0],p[1],p[2]-e)];return vertex(p,g,[p[0]+.31,p[1]]);});tri(ids[0],ids[1],ids[2]);};
  for(let i=0;i<nx-1;i++)for(let j=0;j<ny-1;j++)for(let k=0;k<nz-1;k++){
    const cp=corners.map(([a,b,c])=>coord(i+a,j+b,k+c)),cv=corners.map(([a,b,c])=>field[at(i+a,j+b,k+c)]);
    if(cv.every(v=>v>0)||cv.every(v=>v<0))continue;
    for(const tet of tets){const pts=tet.map(n=>cp[n]),vals=tet.map(n=>cv[n]),cross=[];
      for(const [a,b] of edges)if((vals[a]<0)!==(vals[b]<0)){const f=vals[a]/(vals[a]-vals[b]);cross.push(pts[a].map((v,d)=>v+(pts[b][d]-v)*f));}
      if(cross.length>=3){
        const center=[0,1,2].map(d=>cross.reduce((s,p)=>s+p[d],0)/cross.length),e=.0015;
        let normal=[bodySdf(center[0]+e,center[1],center[2])-bodySdf(center[0]-e,center[1],center[2]),bodySdf(center[0],center[1]+e,center[2])-bodySdf(center[0],center[1]-e,center[2]),bodySdf(center[0],center[1],center[2]+e)-bodySdf(center[0],center[1],center[2]-e)];
        const nl=Math.hypot(...normal)||1;normal=normal.map(v=>v/nl);let axis=[cross[0][0]-center[0],cross[0][1]-center[1],cross[0][2]-center[2]],al=Math.hypot(...axis)||1;axis=axis.map(v=>v/al);const second=[normal[1]*axis[2]-normal[2]*axis[1],normal[2]*axis[0]-normal[0]*axis[2],normal[0]*axis[1]-normal[1]*axis[0]];
        cross.sort((a,b)=>{const angle=p=>{const v=p.map((x,d)=>x-center[d]);return Math.atan2(v[0]*second[0]+v[1]*second[1]+v[2]*second[2],v[0]*axis[0]+v[1]*axis[1]+v[2]*axis[2]);};return angle(a)-angle(b);});
        for(let q=1;q<cross.length-1;q++)emitTri([cross[0],cross[q],cross[q+1]]);
      }
    }
  }
}
emitJoinedBody();

// Swept raised piping/seams. Each tube follows its own centerline and uses a
// closed radial section so the seam reads as part of the garment surface.
function pipe(points,r=.0018,segments=6){for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],axis=b.map((x,k)=>x-a[k]),len=Math.hypot(...axis);if(len<1e-9)continue;const u=axis.map(x=>x/len),helper=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];let v=[u[1]*helper[2]-u[2]*helper[1],u[2]*helper[0]-u[0]*helper[2],u[0]*helper[1]-u[1]*helper[0]],vl=Math.hypot(...v);v=v.map(x=>x/vl);const w=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  const ring=(p,t)=>p.map((x,k)=>x+r*(Math.cos(t)*v[k]+Math.sin(t)*w[k]));for(let s=0;s<segments;s++){const t0=s*2*Math.PI/segments,t1=(s+1)*2*Math.PI/segments;const ids=[ring(a,t0),ring(b,t0),ring(b,t1),ring(a,t1)].map((p,j)=>vertex(p,[Math.cos(t0),0,Math.sin(t0)],[j===1||j===2?1:0,j>=2?1:0]));tri(ids[0],ids[1],ids[2]);tri(ids[0],ids[2],ids[3]);}
}}
function legCenter(side,y){const t=(y-.015)/.735;return [side*(.145-.005*t),.119-.01*t+.006*Math.sin(y*21),.103-.004*t+.004*Math.sin(y*18)];}
for(const side of [-1,1]){
  // Outer and inner trouser seam ridges, with folds naturally breaking their line.
  for(const angle of [0,Math.PI]){const pts=[];for(let k=0;k<=26;k++){const y=.03+k*.027;const [cx,rx,rz]=legCenter(side,y),a=angle;pts.push([cx+rx*Math.cos(a)*1.006,y,rz*Math.sin(a)*1.006]);}pipe(pts,.0015);}
  // A narrow cuff casing around each straight hem.
  for(const y of [.045,.075]){const pts=[];for(let k=0;k<=64;k++){const a=k/64*Math.PI*2,[cx,rx,rz]=legCenter(side,y);pts.push([cx+(rx+.002)*Math.cos(a),y,(rz+.002)*Math.sin(a)]);}pipe(pts,.0022,8);}
}

// Curved front panel patches, parametrized over each leg surface. This keeps
// the cargo bags tangent to the trousers instead of placing detached boxes.
function legSurface(side,y,a,offset=0){const [cx,rx,rz]=legCenter(side,y);const fold=.006*Math.sin(y*55+a*7);return [cx+(rx+fold+offset)*Math.cos(a),y,(rz+fold+offset)*Math.sin(a)];}
function panel(side,y0,y1,a0,a1,offset=.004,rows=10,cols=14){
  return grid(rows,cols,(u,v)=>{const y=y0+(y1-y0)*v,edgeScale=.88+.12*Math.sin(Math.PI*v),a=(a0+a1)/2+(u-.5)*(a1-a0)*edgeScale,bulge=.006*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);return legSurface(side,y,a,offset+bulge);},(u)=>{const a=a0+(a1-a0)*u;return [Math.cos(a),.08,Math.sin(a)];});
}
for(const side of [-1,1]){
  const a0=side>0?.55:1.77,a1=side>0?1.37:2.59,y0=.49,y1=.68;
  panel(side,y0,y1,a0,a1,.004,14,18);
  // Curved flap layered across the top of the cargo pocket.
  panel(side,y1-.042,y1+.008,a0-.04,a1+.04,.008,5,18);
  const outline=[];for(let k=0;k<=18;k++){const u=k/18,a=a0+(a1-a0)*u;outline.push(legSurface(side,y0,a,.011));}
  for(let k=0;k<=10;k++){const v=k/10,y=y0+(y1-y0)*v;outline.push(legSurface(side,y,a1,.011));}
  for(let k=18;k>=0;k--){const u=k/18,a=a0+(a1-a0)*u;outline.push(legSurface(side,y1,a,.011));}
  for(let k=10;k>=0;k--){const v=k/10,y=y0+(y1-y0)*v;outline.push(legSurface(side,y,a0,.011));}
  pipe(outline,.0014,6);
  const flapEdge=[];for(let k=0;k<=18;k++){const a=a0+(a1-a0)*k/18;flapEdge.push(legSurface(side,y1-.043,a,.013));}pipe(flapEdge,.0014,6);
  // Visible eyelet and short curved drawcord, emerging directly from the cuff channel.
  const frontExit=side>0?1.12:2.02;
  for(const angle of [frontExit,Math.PI*2-frontExit]){
    const exit=legSurface(side,.060,angle,.009),normal=[Math.cos(angle),0,Math.sin(angle)],tangent=[-normal[2],0,normal[0]],eyeletPts=[];
    for(let k=0;k<=16;k++){const a=k/16*Math.PI*2;eyeletPts.push(exit.map((v,i)=>v+.008*(Math.cos(a)*(i===1?1:0)+Math.sin(a)*tangent[i])));}
    pipe(eyeletPts,.0018,8);
    const p1=exit.map((v,i)=>v+normal[i]*.004),p2=[p1[0]+side*.003,.041,p1[2]+normal[2]*.006],p3=[p1[0]+side*.007,.012,p1[2]+normal[2]*.010],end=[p1[0]+side*.010,-.025,p1[2]+normal[2]*.013];
    pipe([p1,p2,p3,end],.0032,8);
    sphere(end[0],end[1],end[2],.005);
  }
}

// Waistband, integrated fly and button.
function hipSurface(y,a,offset=0){const [cx,rx,rz]=hip(y);return [cx+(rx+offset)*Math.cos(a),y,(rz+offset)*Math.sin(a)];}
for(const y of [1.025,1.062]){const pts=[];for(let k=0;k<=80;k++){const a=k/80*2*Math.PI;pts.push(hipSurface(y,a,.003));}pipe(pts,.003,8);}
// Distinct raised belt-loop straps cross both waistband edges and stay seated
// on the waist surface; narrow edge welts keep the straps legible in gray views.
for(let k=0;k<8;k++){
  const a=k*2*Math.PI/8,half=.062;
  grid(12,8,(u,v)=>hipSurface(.997+v*.071,a+(u-.5)*half*2,.009),(u)=>[Math.cos(a+(u-.5)*half*2),.08,Math.sin(a+(u-.5)*half*2)]);
  for(const edge of [-1,1]){const pts=[];for(let j=0;j<=10;j++){const y=.999+j*.0067;pts.push(hipSurface(y,a+edge*half,.011));}pipe(pts,.0017,6);}
}
// Fly panel and top-stitch line on the front half.
const fly=[];for(let k=0;k<=18;k++){const y=.80+k*.0115;fly.push(hipSurface(y,Math.PI/2,.008));}pipe(fly,.003,8);
const flySide=[];for(let k=0;k<=18;k++){const y=.80+k*.0115;flySide.push(hipSurface(y,Math.PI/2-.13,.007));}pipe(flySide,.0016,6);
// Button as a low-profile sphere at the center front of the waistband.
function sphere(cx,cy,cz,r){const rows=10,cols=18;grid(rows,cols,(u,v)=>{const phi=v*Math.PI,theta=u*2*Math.PI;return [cx+r*Math.sin(phi)*Math.cos(theta),cy+r*Math.cos(phi),cz+r*Math.sin(phi)*Math.sin(theta)];},(u,v)=>{const phi=v*Math.PI,theta=u*2*Math.PI;return [Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta)];});}
sphere(0,1.045,.116,.012);

// Save a self-contained neutral-gray mesh with dense UVs on every authored panel.
const bytes=(arr)=>Buffer.from(new Float32Array(arr).buffer);let bin=Buffer.alloc(0);const views=[],accessors=[];
function addView(data,target){const offset=(bin.length+3)&~3;bin=Buffer.concat([bin,Buffer.alloc(offset-bin.length),data]);views.push({buffer:0,byteOffset:offset,byteLength:data.length,...(target?{target}:{})});return views.length-1;}
function accessor(data,componentType,count,type,target){const bufferView=addView(data,target);accessors.push({bufferView,componentType,count,type});return accessors.length-1;}
const pos=accessor(bytes(P),5126,P.length/3,'VEC3',34962),normal=accessor(bytes(N),5126,N.length/3,'VEC3',34962),uv=accessor(bytes(UV),5126,UV.length/2,'VEC2',34962);
const idx=accessor(Buffer.from(new Uint32Array(I).buffer),5125,I.length,'SCALAR',34963);
const g={asset:{version:'2.0',generator:'AtelierX authored pants panels'},scene:0,scenes:[{nodes:[0]}],nodes:[{name:'AtelierX cargo trouser geometry',mesh:0}],meshes:[{name:'Standalone cargo trousers',primitives:[{attributes:{POSITION:pos,NORMAL:normal,TEXCOORD_0:uv},indices:idx,material:0,mode:4}]}],materials:[{name:'Neutral gray shape review',doubleSided:true,pbrMetallicRoughness:{baseColorFactor:[.38,.38,.38,1],metallicFactor:0,roughnessFactor:.82}}],buffers:[{byteLength:bin.length}],bufferViews:views,accessors};
const invalid=[];for(let i=0;i<P.length;i++)if(!Number.isFinite(P[i])){invalid.push(i);if(invalid.length===8)break;}if(invalid.length)throw Error(`Invalid position values at ${invalid.join(',')}`);
const bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<P.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],P[i+k]);bounds[1][k]=Math.max(bounds[1][k],P[i+k]);}
fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});writeGlb(path.join(root,out),{g,bin});
console.log(JSON.stringify({output:out,vertices:P.length/3,triangles:I.length/3,uvVertices:UV.length/2,bounds,displayEnvelopeCm:{width:(bounds[1][0]-bounds[0][0])*100,height:(bounds[1][1]-bounds[0][1])*100,depth:(bounds[1][2]-bounds[0][2])*100},features:['separate straight legs with sculpted fold modulation','continuous hip/seat shell','curved cargo pockets with flaps and seam piping','integrated waistband and conforming belt loops','raised fly and button','cuffed hems with drawcords'],uv:'TEXCOORD_0 authored for all vertices; no texture maps; per-panel UV'},null,2));
