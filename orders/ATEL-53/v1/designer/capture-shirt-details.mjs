import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium}=require('playwright-core');
const out=process.argv[2]||'orders/ATEL-53/v1/designer/detail-capture';
const url=process.argv[3]||'http://127.0.0.1:8787/atelierx-products/quality-preview/ATEL-53/v1.1/index.html';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.ATELIERX_BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
if(!response?.ok())throw new Error(`Preview HTTP ${response?.status()}`);
const viewer=page.locator('model-viewer').first();await page.waitForFunction(()=>document.querySelector('model-viewer')?.loaded===true,{timeout:30000});
const views={
  collarCloseup:{orbit:'12deg 69deg 0.36m',target:'0m 1.42m 0m'},
  placketSideCloseup:{orbit:'25deg 86deg 0.40m',target:'0m 1.10m 0m'},
  cuffCloseup:{orbit:'18deg 82deg 0.36m',target:'0.45m 0.84m 0m'}
};
for(const [name,v] of Object.entries(views)){
  await viewer.evaluate((el,c)=>{el.setAttribute('camera-target',c.target);el.setAttribute('camera-orbit',c.orbit);el.jumpCameraToGoal?.();},v);
  await page.waitForTimeout(600);
  await viewer.screenshot({path:path.join(out,`${name}.png`),animations:'disabled'});
}
await browser.close();
fs.writeFileSync(path.join(out,'detail-browser-result.json'),JSON.stringify({url,loaded:true,errors,views},null,2)+'\n');
console.log(JSON.stringify({out,url,errors},null,2));
if(errors.length)process.exitCode=1;
