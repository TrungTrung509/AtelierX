import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlow,destinations,taskTitle,recordCandidate} from './studio-flow.mjs';
test('one QA task is reused for shape and final; routing bypasses Lead',()=>{
  const f=createFlow('ATEL-99','Áo thun kem','request-uuid');
  assert.equal(Object.keys(f.tasks).length,6);
  assert.deepEqual(destinations({stage:'shape'},{}),['qa']);
  assert.deepEqual(destinations({stage:'shape-review'},{decision:'pass'}),['material']);
  assert.deepEqual(destinations({stage:'visual'},{}),['qa']);
  assert.deepEqual(destinations({stage:'qa-final'},{decision:'pass'}),['research','designer','material','visual','lead']);
  assert.equal(taskTitle('ATEL-99','material','Áo thun kem'),'ATEL-99 · Hoàn thiện màu và chất liệu · Áo thun kem');
});
test('global source budget prevents an endless sequence of different bases',()=>{
  const f=createFlow('ATEL-99','Áo thun','r','2026-11-15T00:00:00Z');
  recordCandidate(f,'one','2026-11-15T00:01:00Z');recordCandidate(f,'two','2026-11-15T00:02:00Z');
  assert.throws(()=>recordCandidate(f,'three','2026-11-15T00:03:00Z'),/hai nguồn/);
  const late=createFlow('ATEL-98','Áo','r','2026-11-15T00:00:00Z');
  assert.throws(()=>recordCandidate(late,'one','2026-11-15T00:16:00Z'),/15 phút/);
  assert.deepEqual(destinations({stage:'qa-final'},{decision:'return',correctionOwner:'material'}),['material']);
});
