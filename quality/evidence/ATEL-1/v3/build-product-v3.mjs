import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const root='quality/evidence/ATEL-1/v3';
const base='quality/evidence/ATEL-17/clean-v2-neckfix-placement-v3/hoodie-mesh-revision.glb';
const expectedGeometrySha='34374edd321b7e8396656e7d5a003e359d9349c5cc35bb5bc37a5c99145141bf';
const sourceSha='42dc0075e632eab84256f71d9cc88b6eb6d54d04cbff3682f548f62e55994a13';
const geometry=fs.readFileSync(base);const geometrySha=crypto.createHash('sha256').update(geometry).digest('hex');
if(geometrySha!==expectedGeometrySha)throw new Error(`Geometry SHA mismatch: ${geometrySha}`);
const svgPath=`${root}/artwork/one-eyed-skull-back-v3.svg`,svg=fs.readFileSync(svgPath,'utf8');
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:16,height:16}});
const textureB64=await page.evaluate(async svgText=>{
  const size=2048,c=document.createElement('canvas');c.width=size;c.height=size;const x=c.getContext('2d',{willReadFrequently:true});
  const im=x.createImageData(size,size);let seed=0x4154454c;for(let i=0;i<im.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const n=((seed>>>29)&7)-3;const weave=((Math.floor(i/4)%size)%5===0)?1:0;const v=15+n+weave;im.data[i]=v;im.data[i+1]=v+1;im.data[i+2]=v+3;im.data[i+3]=255;}x.putImageData(im,0,0);
  const art=new Image();art.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgText);await art.decode();
  // Clean-v3 placement profile: back UV island is rotated +90°. The portrait mark
  // is rotated around its measured center, matching the independently verified profile.
  x.save();x.translate(.5*size,.763*size);x.rotate(Math.PI/2);x.drawImage(art,-.046*size,-.069*size,.092*size,.138*size);x.restore();
  return c.toDataURL('image/png').split(',')[1];
},svg);await browser.close();
const png=Buffer.from(textureB64,'base64');fs.writeFileSync(`${root}/hoodie-black-skull-texture-v3.png`,png);
const jl=geometry.readUInt32LE(12),gltf=JSON.parse(geometry.toString('utf8',20,20+jl)),bh=20+jl,binLength=geometry.readUInt32LE(bh),bin=geometry.subarray(bh+8,bh+8+binLength);
if(gltf.materials?.[0]?.name!=='hoodie_body_pbr')throw new Error('Expected approved hoodie material slot');
const g=structuredClone(gltf),padOff=(binLength+3)&~3,blob=Buffer.concat([bin,Buffer.alloc(padOff-binLength),png]);
g.bufferViews.push({buffer:0,byteOffset:padOff,byteLength:png.length});
g.images.push({bufferView:g.bufferViews.length-1,mimeType:'image/png',name:'ATEL-1 v3 black fabric with one-eyed skull back print'});
g.textures.push({sampler:g.samplers?.length?0:undefined,source:g.images.length-1});
const textureIndex=g.textures.length-1;g.materials[0].pbrMetallicRoughness.baseColorTexture={index:textureIndex};
g.materials[0].name='ATEL-1 v3 black hoodie fabric';g.asset.extras={...(g.asset.extras||{}),order:'ATEL-1',revision:'v3',baseMeshId:'grab3d-hoodie-clean-v2-neckfix-placement-v3',geometrySha256:geometrySha};
g.buffers[0].byteLength=padOff+png.length;
const jbuf=Buffer.from(JSON.stringify(g)),jp=Buffer.alloc((4-jbuf.length%4)%4,0x20),bp=Buffer.alloc((4-blob.length%4)%4),h=Buffer.alloc(12);h.write('glTF');h.writeUInt32LE(2,4);h.writeUInt32LE(12+8+jbuf.length+jp.length+8+blob.length+bp.length,8);
const jh=Buffer.alloc(8);jh.writeUInt32LE(jbuf.length+jp.length);jh.write('JSON',4);const bh2=Buffer.alloc(8);bh2.writeUInt32LE(blob.length+bp.length);bh2.write('BIN\0',4);
const out=Buffer.concat([h,jh,jbuf,jp,bh2,blob,bp]),outPath=`${root}/hoodie-black-one-eyed-skull-v3.glb`;fs.writeFileSync(outPath,out);
const outSha=crypto.createHash('sha256').update(out).digest('hex'),textureSha=crypto.createHash('sha256').update(png).digest('hex'),artSha=crypto.createHash('sha256').update(fs.readFileSync(svgPath)).digest('hex');
console.log(JSON.stringify({geometrySha,outputSha256:outSha,textureSha256:textureSha,artworkSha256:artSha,output:outPath,textureBytes:png.length},null,2));
