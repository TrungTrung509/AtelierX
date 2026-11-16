import test from 'node:test';
import assert from 'node:assert/strict';
import {readGlb} from './showcase-glb.mjs';
import {checkButtons} from './check-shirt-buttons.mjs';
import fs from 'node:fs';
test('detects edge-on buttons in the failed v4.3 regression asset',()=>{const file=new URL('../orders/ATEL-23/v4.3/designer/garment-v4_3.glb',import.meta.url);if(fs.existsSync(file))assert.equal(checkButtons(readGlb(file)).passed,false)});
test('shirt masking reaches shoulder while protecting neck',()=>{const p=JSON.parse(fs.readFileSync(new URL('../quality/showcase-presets.json',import.meta.url))).shirt;assert(p.mask.maxY>1.51);assert(p.mask.maxY<1.57)});
