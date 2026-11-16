import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire('/usr/local/lib/node_modules/crewly/package.json');
const { chromium } = require('playwright-core');
const output = 'quality/evidence/ATEL-35/v0.5';
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const result = {
  orderId: 'ATEL-35',
  revision: 'v0.5-gray',
  garment: 'orders/ATEL-35/v0.5/designer/garment-v0_5.glb',
  garmentSha256: sha256('orders/ATEL-35/v0.5/designer/garment-v0_5.glb'),
  url: 'http://127.0.0.1:8788/index.html',
  loaded: false,
  rotated: false,
  zoomed: false,
  desktop: false,
  screenshots: {},
  screenshotSha256: {},
  errors: [],
};
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => result.errors.push(error.message));
  const response = await page.goto(result.url, { waitUntil: 'domcontentloaded' });
  if (!response?.ok()) throw new Error(`Viewer HTTP ${response?.status()}`);
  const viewer = page.locator('model-viewer').first();
  await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded === true, { timeout: 30000 });
  result.loaded = true;
  for (const [name, degrees] of Object.entries({ front: 0, back: 180, side: 90, oblique: 45 })) {
    await viewer.evaluate((element, angle) => {
      element.setAttribute('camera-orbit', `${angle}deg 82deg auto`);
      element.jumpCameraToGoal?.();
    }, degrees);
    await page.waitForTimeout(500);
    const file = `${output}/${name}.png`;
    await page.screenshot({ path: file, animations: 'disabled' });
    result.screenshots[name] = file;
    result.screenshotSha256[name] = sha256(file);
  }
  result.desktop = true;
  await viewer.evaluate(element => element.setAttribute('camera-orbit', '0deg 82deg 2.6m'));
  await page.waitForTimeout(300);
  const before = await viewer.evaluate(element => element.getCameraOrbit());
  const box = await viewer.boundingBox();
  if (!box) throw new Error('Viewer bounds missing');
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 140, center.y + 18, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const after = await viewer.evaluate(element => element.getCameraOrbit());
  result.rotated = Math.abs(after.theta - before.theta) > 0.05;
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(500);
  const zoom = await viewer.evaluate(element => element.getCameraOrbit());
  result.zoomed = Math.abs(zoom.radius - after.radius) > 0.02;
  result.interactionOrbit = { before: before.radius, afterRotate: after.radius, afterZoom: zoom.radius };
  await page.close();
} catch (error) {
  result.errors.push(error.message);
} finally {
  await browser.close();
  fs.writeFileSync(`${output}/browser-result.json`, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (!result.loaded || !result.rotated || !result.zoomed || !result.desktop || result.errors.length) process.exitCode = 1;
}
