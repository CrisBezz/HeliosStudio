import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { build } from 'esbuild';
import * as THREE from 'three';
const outfile=new URL('../.texture-tests.mjs',import.meta.url);
await build({stdin:{contents:`export {PbrTextureManager} from './src/engine/textures'; export {StudioEngine} from './src/engine/StudioEngine'; export {importModelFromFile} from './src/engine/models';`,resolveDir:process.cwd(),loader:'ts'},outfile:outfile.pathname,bundle:true,platform:'node',format:'esm',packages:'external',plugins:[{name:'fixture-loader',setup(b){b.onResolve({filter:/^three\/addons\/loaders\/GLTFLoader.js$/},()=>({path:'loader',namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:`export class GLTFLoader {parse(buffer,path,resolve,reject){try{resolve({scene:globalThis.fixtureScene()})}catch(e){reject(e)}}}`,loader:'js'}));}}]});
const {PbrTextureManager,StudioEngine,importModelFromFile}=await import(outfile.href);
await fs.unlink(outfile);
const bytes=()=>new Uint8ClampedArray(1024*1024*4).fill(255);
let pixelBytes=bytes();
globalThis.document = {
 createElement() {
  return { width:0, height:0, getContext() {
   return { drawImage(){},save(){},restore(){},translate(){},scale(){},getImageData(){return {data:pixelBytes};} };
  }};
 }
};
function scene(count){const g=new THREE.Group();for(let i=0;i<count;i++){const mat=new THREE.MeshStandardMaterial();mat.name='Material '+i;mat.map=new THREE.Texture({width:1,height:1});const mesh=new THREE.Mesh(new THREE.BoxGeometry(),mat);mesh.position.x=i*2;g.add(mesh);}return g;}
function engine(manager){const e=Object.create(StudioEngine.prototype);Object.assign(e,{textureManager:manager,materialLayerMap:new Map(),pendingTextureUploads:new Map(),materials:[{id:'a',texturePreset:'none',normalStrength:1}],currentProject:null,disposed:false,renderer:{capabilities:{getMaxAnisotropy(){return 1}}},pathTracer:{setTextureArrays(){},resetAccumulation(){}},requestDraw(){}});return e;}
const file={name:'maps.glb',arrayBuffer:async()=>new ArrayBuffer(0)};

test('eight layers are exclusive; ninth preserves pixels; non-next released slot is reused and reset neutral',()=>{
 const m=new PbrTextureManager(1);try{const ids=Array.from({length:8},()=>m.allocateCustomLayer());assert.deepEqual(ids,[100,101,102,103,104,105,106,107]);ids.forEach((id,i)=>m.customAlbedoBytes[(id-100)*1024*1024*4]=i+1);const before=m.customAlbedoBytes.slice();assert.throws(()=>m.allocateCustomLayer(),/eight/);assert.deepEqual(m.customAlbedoBytes,before);m.releaseCustomLayer(103);assert.equal(m.allocateCustomLayer(),103);for(let i=0;i<8;i++)assert.equal(m.customAlbedoBytes[i*1024*1024*4],i===3?255:i+1);assert.throws(()=>m.allocateCustomLayer(),/eight/);m.resetCustomCounter();assert.equal(m.allocateCustomLayer(),100);}finally{m.dispose();}
});

test('failed decode preserves existing pixels; released/reused lease rejects late image and revokes URLs',async()=>{
 const m=new PbrTextureManager(1),layer=m.allocateCustomLayer();let pending;let revoked=0;const oldURL=globalThis.URL,oldImage=globalThis.Image;globalThis.URL={createObjectURL(){return'blob:test'},revokeObjectURL(){revoked++}};globalThis.Image=class{constructor(){pending=this}set src(v){}};
 try{m.customAlbedoBytes[0]=42;const failed=m.writeFileToLayer(layer,'albedo',{name:'bad.png'});pending.onerror();await assert.rejects(failed,/decode/);assert.equal(m.customAlbedoBytes[0],42);const late=m.writeFileToLayer(layer,'albedo',{name:'late.png'});m.releaseCustomLayer(layer);assert.equal(m.allocateCustomLayer(),layer);m.customAlbedoBytes[0]=77;pending.onload();await assert.rejects(late,/cancelled/);assert.equal(m.customAlbedoBytes[0],77);assert.equal(revoked,2);}finally{globalThis.URL=oldURL;globalThis.Image=oldImage;m.dispose();}
});

test('actual engine upload rolls back reservation on failure, reuses material slot, and Restore releases it',async()=>{
 const m=new PbrTextureManager(1),e=engine(m);try{m.writeFileToLayer=async()=>{throw Error('bad decode')};const material=e.materials[0];await assert.rejects(e.uploadMaterialTexture('a','albedo',{}),/bad decode/);assert.equal(e.materialLayerMap.size,0);assert.equal(e.materials[0],material);assert.equal(m.customLeases.size,0);m.writeFileToLayer=async()=>{};await e.uploadMaterialTexture('a','albedo',{});assert.equal(e.materialLayerMap.get('a'),100);await e.uploadMaterialTexture('a','normal',{});assert.equal(m.customLeases.size,1);assert.equal(e.materials[0].hasCustomNormal,true);e.updateMaterials([{...e.materials[0],hasCustomAlbedo:false,hasCustomNormal:false,hasCustomRoughness:false}]);assert.equal(m.customLeases.size,0);assert.equal(m.allocateCustomLayer(),100);}finally{m.dispose();}
});

test('actual importer rolls back overflow reservations and retains existing map and occupied bytes',async()=>{
 const m=new PbrTextureManager(1);try{const existing=m.allocateCustomLayer();m.customAlbedoBytes[0]=61;const map=new Map([['old',existing]]);globalThis.fixtureScene=()=>scene(8);await assert.rejects(importModelFromFile(file,true,m,map),/eight/);assert.deepEqual([...map],[['old',100]]);assert.equal(m.customAlbedoBytes[0],61);assert.deepEqual([...m.customLeases.keys()],[100]);globalThis.fixtureScene=()=>scene(7);const result=await importModelFromFile(file,true,m,map);assert.equal(result.materials.length,7);assert.equal(new Set(map.values()).size,8);}finally{m.dispose();}
});

test('private import capacity failure preserves live scene; success swaps manager only after preparation',async()=>{
 const old=new PbrTextureManager(1),e=engine(old);const initial=e.materials;const layer=old.allocateCustomLayer();old.customAlbedoBytes[0]=29;e.materialLayerMap.set('a',layer);e.installBuiltProject=function(b){this.currentProject=b;this.materials=b.materials;};try{globalThis.fixtureScene=()=>scene(9);await assert.rejects(e.loadCustomFile(file),/eight/);assert.equal(e.textureManager,old);assert.equal(e.materials,initial);assert.equal(e.materialLayerMap.get('a'),layer);assert.equal(old.customAlbedoBytes[0],29);assert.equal(old.disposed,false);globalThis.fixtureScene=()=>scene(8);await e.loadCustomFile(file);assert.notEqual(e.textureManager,old);assert.equal(old.disposed,true);assert.equal(e.materialLayerMap.size,8);assert.equal(new Set(e.materialLayerMap.values()).size,8);}finally{e.textureManager.dispose();if(e.textureManager!==old)old.dispose();}
});

test('import image-write failure releases every reservation and publishes no partial mapping',async()=>{
 const m=new PbrTextureManager(1);try{const map=new Map([['unchanged',0]]);globalThis.fixtureScene=()=>scene(3);let calls=0;const write=m.writeImageToLayer.bind(m);m.writeImageToLayer=(...args)=>{if(++calls===2)throw Error('image canvas failed');return write(...args);};await assert.rejects(importModelFromFile(file,true,m,map),/image canvas failed/);assert.deepEqual([...map],[['unchanged',0]]);assert.equal(m.customLeases.size,0);assert.equal(m.allocateCustomLayer(),100);}finally{m.dispose();}
});

test('material removal releases its custom slot without touching another material',async()=>{
 const m=new PbrTextureManager(1),e=engine(m);try{e.materials.push({id:'b',texturePreset:'none',normalStrength:1});m.writeFileToLayer=async()=>{};await e.uploadMaterialTexture('a','albedo',{});await e.uploadMaterialTexture('b','albedo',{});m.customAlbedoBytes[1024*1024*4]=83;e.updateMaterials([e.materials[1]]);assert.deepEqual([...m.customLeases.keys()],[101]);assert.equal(m.customAlbedoBytes[1024*1024*4],83);assert.equal(m.allocateCustomLayer(),100);}finally{m.dispose();}
});
