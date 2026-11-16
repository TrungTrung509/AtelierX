import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

test('viewer scaffold has mannequin scene, readable content hooks, credits and immutable revisions', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atelierx-viewer-test-'));
  try {
    fs.mkdirSync(path.join(dir, 'tools'));
    const script = path.join(dir, 'tools/create-product-viewer.mjs');
    fs.copyFileSync(new URL('./create-product-viewer.mjs', import.meta.url), script);
    const run = (...args) => spawnSync(process.execPath, [script, ...args], {encoding:'utf8'});
    assert.notEqual(run('../escape','v1').status, 0);
    assert.equal(run('ATEL-999','v1').status, 0);
    const dest = path.join(dir,'showcase/products/ATEL-999/v1');
    const html = fs.readFileSync(path.join(dest,'index.html'),'utf8');
    for (const value of ['assets/display.glb','product-content','product-paragraphs','product-credits','view-back']) assert(html.includes(value));
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i);
    const content = JSON.parse(fs.readFileSync(path.join(dest,'content.json')));
    assert.equal(content.revision,'v1');
    assert(content.credits[0].includes('CC BY 4.0'));
    assert.notEqual(run('ATEL-999','v1').status, 0);
  } finally {
    const target = path.resolve(dir);
    if (!target.startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(target).startsWith('atelierx-viewer-test-')) throw new Error('Unexpected cleanup path');
    fs.rmSync(target,{recursive:true,force:true});
  }
});
