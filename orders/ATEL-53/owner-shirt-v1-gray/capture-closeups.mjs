import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const url='http://127.0.0.1:8787/atelierx-products/quality-preview/ATEL-53/owner-shirt-v1-gray/index.html';
const out='orders/ATEL-53/owner-shirt-v1-gray/captures';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
if(!response?.ok())throw Error(`viewer HTTP ${response?.status()}`);
await page.waitForFunction(()=>document.querySelector('model-viewer')?.loaded===true,{timeout:30000});
const v=page.locator('model-viewer').first();
const dims=await v.evaluate(e=>({dimensions:e.getDimensions(),center:e.getBoundingBoxCenter()}));
const shots=[
 ['collarCloseup','0deg 82deg 0.43m','-0.01m 1.64m 0.03m'],
 ['placketSideCloseup','0deg 82deg 0.49m','-0.01m 1.39m 0.10m'],
 ['cuffCloseup','0deg 82deg 0.42m','0.25m 1.10m 0.08m']
];
for(const [name,orbit,target] of shots){
 await v.evaluate((e,x)=>{e.setAttribute('camera-target',x.target);e.setAttribute('camera-orbit',x.orbit);e.jumpCameraToGoal?.()}, {orbit,target});
 await page.waitForTimeout(600);
 await page.screenshot({path:`${out}/${name}.png`,animations:'disabled'});
}
await browser.close();
const result={url,loaded:true,dimensions:dims,closeups:shots.map(x=>x[0]),errors};
fs.writeFileSync(`${out}/closeup-result.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
