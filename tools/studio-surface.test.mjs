import test from 'node:test';
import assert from 'node:assert/strict';
import {applySurface} from './studio-surface.mjs';
test('surface preserves geometry/UV and separates front artwork from the back',()=>{
  const doc={bin:Buffer.from([1,2,3,4]),g:{meshes:[0,1].map(()=>({primitives:[{attributes:{POSITION:0,TEXCOORD_0:1},indices:2}]}))}};
  const material={appearance:{metallicFactor:0,roughnessFactor:.9,baseColorFactorLinear:[1,1,1,1]}};
  const result=applySurface(doc,Buffer.from('png'),material,{surfaceMapping:{flowerMaterialMeshes:[0],creamOnlyMeshes:[1]}});
  assert.deepEqual([...result.bin.subarray(0,4)],[1,2,3,4]);
  assert.equal(result.g.meshes[0].primitives[0].attributes.TEXCOORD_0,1);
  assert.notEqual(result.g.meshes[0].primitives[0].material,result.g.meshes[1].primitives[0].material);
  assert.throws(()=>applySurface(doc,Buffer.alloc(0),material,{surfaceMapping:{flowerMaterialMeshes:[0],creamOnlyMeshes:[]}}));
});
