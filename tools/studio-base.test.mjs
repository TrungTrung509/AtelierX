import test from 'node:test';
import assert from 'node:assert/strict';
import {shortlist,inside} from './studio-base.mjs';
test('shortlist excludes rejected, wrong type, changed geometry and missing actual previews',()=>{
  const good={garmentType:'tshirt',status:'ready',file:'a.glb',sha256:'ok',images:{front:'front.png',back:'back.png'}};
  const library={bases:[good,{...good,status:'rejected'},{...good,garmentType:'shirt'},{...good,sha256:'old'},{...good,images:{front:'front.png'}}]};
  assert.equal(shortlist(library,'tshirt',()=>true,()=> 'ok').length,1);
  assert.throws(()=>inside('../outside'));
});
