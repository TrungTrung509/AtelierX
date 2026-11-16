import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire('/usr/local/lib/node_modules/crewly/package.json');
const {chromium} = require('playwright-core');
const args = process.argv.slice(2);
const flag = name => args[args.indexOf(name) + 1];
const url = flag('--url');
const out = flag('--out');
const frontDeg = Number(args.includes('--front-deg') ? flag('--front-deg') : 0);
const basic=args.includes('--basic');
const garment=args.includes('--garment');
const detailDeg = Number(args.includes('--detail-deg') ? flag('--detail-deg') : frontDeg + 180);
if (!url || !out || !Number.isFinite(frontDeg) || !Number.isFinite(detailDeg) || !/^http:\/\/127\.0\.0\.1:8787\/atelierx-products\/(products|quality-preview)\//.test(url)) {
  console.error('Dùng --url http://127.0.0.1:8787/atelierx-products/products/ATEL-N/vN/index.html --out <thư mục>');
  process.exit(2);
}
fs.mkdirSync(out, {recursive: true});
const browser = await chromium.launch({executablePath: process.env.ATELIERX_BROWSER_BIN || '/usr/bin/chromium', headless:true, args:['--no-sandbox','--disable-dev-shm-usage']});
const evidence = {url,loaded:false,rotated:false,zoomed:false,desktop:false,screenshots:{},errors:[]};
if (!basic) evidence.mobile = false;
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}, deviceScaleFactor:1});
  page.on('pageerror', error => evidence.errors.push(error.message));
  const response = await page.goto(url, {waitUntil:'domcontentloaded',timeout:30000});
  if (!response?.ok()) throw new Error(`Viewer HTTP ${response?.status()}`);
  await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded === true, {timeout:30000});
  evidence.loaded = true;
  const viewer = page.locator('model-viewer').first();
  await viewer.evaluate(el => el.setAttribute('interaction-prompt', 'none'));
  await page.mouse.move(8, 8);
  const views = basic ? {front:`${frontDeg}deg 82deg auto`,back:`${frontDeg+180}deg 82deg auto`,side:`${frontDeg+90}deg 82deg auto`,oblique:`${frontDeg+45}deg 82deg auto`} : {front:`${frontDeg}deg 82deg auto`,back:`${frontDeg+180}deg 82deg auto`,left:`${frontDeg+90}deg 82deg auto`,right:`${frontDeg+270}deg 82deg auto`,detail:`${detailDeg}deg 82deg 1.5m`};
  if(garment){views.top=`${frontDeg}deg 8deg auto`;views.bottom=`${frontDeg}deg 172deg auto`;}
  for (const [name, orbit] of Object.entries(views)) {
    await viewer.evaluate((el, value) => {el.setAttribute('camera-orbit', value); el.jumpCameraToGoal?.();}, orbit);
    await page.waitForTimeout(400);
    const file = path.join(out, `${name}.png`);
    await page.screenshot({path:file, animations:'disabled'});
    evidence.screenshots[name] = file;
  }
  evidence.desktop = true;
  await viewer.evaluate((el,deg) => {el.setAttribute('camera-orbit',`${deg}deg 82deg 2.6m`); el.jumpCameraToGoal?.();},frontDeg);
  await page.waitForTimeout(250);
  const before = await viewer.evaluate(el => el.getCameraOrbit());
  const box = await viewer.boundingBox();
  if (!box) throw new Error('Không tìm thấy vùng hiển thị model');
  const center = {x:box.x + box.width/2,y:box.y + box.height/2};
  await page.mouse.move(center.x,center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 150,center.y + 20,{steps:12});
  await page.mouse.up();
  await page.waitForTimeout(700);
  const after = await viewer.evaluate(el => el.getCameraOrbit());
  evidence.rotated = Math.abs(after.theta - before.theta) > 0.05;
  await page.mouse.wheel(0,-450);
  await page.waitForTimeout(300);
  const zoomed = await viewer.evaluate(el => el.getCameraOrbit());
  evidence.zoomed = Math.abs(zoomed.radius - after.radius) > 0.02;
  if(!process.argv.includes('--basic')){
  const mobile = await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const mobileResponse = await mobile.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  if (!mobileResponse?.ok()) throw new Error(`Mobile viewer HTTP ${mobileResponse?.status()}`);
  await mobile.waitForFunction(() => document.querySelector('model-viewer')?.loaded === true,{timeout:30000});
  const mobileFile = path.join(out,'mobile.png');
  await mobile.screenshot({path:mobileFile,animations:'disabled'});
  evidence.screenshots.mobile = mobileFile;
  evidence.mobile = true;
  await mobile.close();
  }
  await page.close();
} catch (error) {
  evidence.errors.push(error.message);
} finally {
  await browser.close();
  fs.writeFileSync(path.join(out,'browser-result.json'),JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence,null,2));
  if (!evidence.loaded || !evidence.rotated || !evidence.zoomed || !evidence.desktop || (!basic&&!evidence.mobile) || evidence.errors.length) process.exitCode = 1;
}
