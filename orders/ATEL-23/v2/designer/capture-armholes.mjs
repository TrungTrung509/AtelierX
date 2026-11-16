import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const out='quality/evidence/ATEL-23/v2/browser-fit';
fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage({viewport:{width:1440,height:1000}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:8787/atelierx-products/quality-preview/atel23-fit-v2/index.html',{waitUntil:'domcontentloaded'});
await p.waitForFunction(()=>document.querySelector('model-viewer')?.loaded===true,{timeout:30000});
const mv=p.locator('model-viewer').first();
const views=[
 ['armhole-back-positiveX',.20,225],
 ['armhole-back-negativeX',-.20,135]
];
const actual=[];
for(const [name,x,theta] of views){
 await mv.evaluate((el,v)=>{el.setAttribute('min-camera-orbit','auto auto 0.12m');el.cameraTarget=`${v.x}m 1.455m -0.055m`;el.cameraOrbit=`${v.theta}deg 80deg 0.65m`;el.jumpCameraToGoal();},{x,theta});
 await p.waitForTimeout(1000);
 actual.push(await mv.evaluate(el=>({target:el.getCameraTarget(),orbit:el.getCameraOrbit()})));
 await p.screenshot({path:`${out}/${name}.png`,animations:'disabled'});
}
await b.close();
console.log(JSON.stringify({captures:views.map(v=>`${out}/${v[0]}.png`),actual,errors},null,2));
if(errors.length)process.exitCode=1;
