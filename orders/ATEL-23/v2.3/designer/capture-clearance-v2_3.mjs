import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const out='quality/evidence/ATEL-23/v2.3/browser-fit';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8787/atelierx-products/quality-preview/atel23-fit-v2_3/index.html',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>document.querySelector('model-viewer')?.loaded===true,{timeout:30000});
const viewer=page.locator('model-viewer').first();
const views=[
 ['collar-front-detail',0,1.56,.02,0,70,.72],
 ['collar-side-detail',0,1.56,-.01,90,72,.72],
 ['cuff-positiveX-detail',.70,1.50,-.02,90,75,.68],
 ['cuff-negativeX-detail',-.70,1.50,-.02,270,75,.68],
 ['hem-front-detail',0,.95,.05,0,75,.85],
 ['armhole-rear-wide',0,1.405,-.045,180,80,2.25]
];
const captures=[];
for(const [name,x,y,z,theta,phi,radius] of views){
 await viewer.evaluate((el,v)=>{el.setAttribute('min-camera-orbit','auto auto 0.65m');el.cameraTarget=`${v.x}m ${v.y}m ${v.z}m`;el.cameraOrbit=`${v.theta}deg ${v.phi}deg ${v.radius}m`;el.jumpCameraToGoal();},{x,y,z,theta,phi,radius});
 await page.waitForTimeout(800);
 const camera=await viewer.evaluate(el=>({target:el.getCameraTarget(),orbit:el.getCameraOrbit()}));
 const file=`${out}/${name}.png`;await page.screenshot({path:file,animations:'disabled'});
 captures.push({path:file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),camera});
}
const result={loaded:true,errors,captures,garmentSha256:crypto.createHash('sha256').update(fs.readFileSync('orders/ATEL-23/v2.3/designer/garment-v2.3.glb')).digest('hex'),fitPreviewSha256:crypto.createHash('sha256').update(fs.readFileSync('orders/ATEL-23/v2.3/fit-evidence/garment-on-mannequin-v2.3.glb')).digest('hex')};
fs.writeFileSync(`${out}/clearance-oblique-result.json`,JSON.stringify(result,null,2)+'\n');
await browser.close();console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
