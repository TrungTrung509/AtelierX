import {readGlb,writeGlb,primitives} from './showcase-glb.mjs';

// Keep the approved fabric shell open at neck, hem and wrists. Show its inner
// face when the camera looks into the garment, with no torso or end caps.
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Usage: node tools/make-sweater-hollow.mjs input.glb output.glb');
const doc=readGlb(input);
if(primitives(doc).length!==1||doc.g.meshes.length!==1)throw Error('Expected the single-shell sweater source');
const shell=doc.g.meshes[0].primitives[0];
doc.g.materials[shell.material].doubleSided=true;
doc.g.extras={...(doc.g.extras||{}),atelierxPresentation:'Hollow sweater shell; neck, hem and cuffs remain open; no mannequin or solid insert'};
writeGlb(output,doc);
console.log(JSON.stringify({output,meshCount:doc.g.meshes.length,primitiveCount:primitives(doc).length,doubleSided:doc.g.materials[shell.material].doubleSided}));
