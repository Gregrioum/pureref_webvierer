// Run with: node tests/shapes.test.cjs
// Synthetic records only; no user boards or images are included.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('const shapeTools = (() => {');
const end=html.indexOf('\n})();',start)+7;
assert.ok(start>=0&&end>start);
const context={TextEncoder,Uint8Array,DataView};
vm.createContext(context);
vm.runInContext(html.slice(start,end)+';globalThis.api=shapeTools;',context);
const api=context.api;
const plain=value=>JSON.parse(JSON.stringify(value));
const u32=v=>{const b=Buffer.alloc(4);b.writeUInt32BE(v);return b;};
const u16=v=>{const b=Buffer.alloc(2);b.writeUInt16BE(v);return b;};
const f64=v=>{const b=Buffer.alloc(8);b.writeDoubleBE(v);return b;};
function encodedStroke({version=100,spec=1,style=0,points=[[0,0,0],[1,10,20],[2,20,30],[3,30,40],[3,40,20]],width=4}={}) {
  return Buffer.concat([Buffer.from([version,spec]),u16(32768),u16(65535),u16(0),u16(0),u16(0),f64(width),u32(points.length),
    ...points.flatMap(([kind,x,y])=>[u32(kind),f64(x),f64(y)]),...(points.length?[u32(0),u32(0)]:[]),f64(0),f64(0),u32(style)]);
}
function drawing(strokes) {
  const marker=Buffer.from('QList<GraphicsDrawItem::Stroke>\0');
  return Buffer.concat([u32(1024),Buffer.from([0]),u32(marker.length),marker,u32(strokes.length),...strokes]);
}
const original=drawing([encodedStroke(),encodedStroke({points:[[0,100,200],[1,110,210]],width:10})]);
const parsed=api.decodeStrokes(original);
assert.equal(parsed.strokes.length,2);
assert.deepEqual(plain(parsed.strokes[0].commands),[['M',0,0],['L',10,20],['C',20,30,30,40,40,20]]);
assert.equal(parsed.strokes[0].width,4);
assert.equal(parsed.strokes[0].color,'rgba(255,0,0,0.5000076295109483)');
assert.deepEqual(plain(parsed.bounds),{x:-2,y:-2,width:117,height:217});
assert.equal(api.argb('#52faff9d'),'#faff9d52');
assert.equal(api.argb('#112233'),'#112233');
assert.equal(api.argb('invalid'),null);
assert.equal(api.decodeStrokes(drawing([])).bounds,null);
assert.equal(api.decodeStrokes(drawing([encodedStroke({points:[]})])).bounds,null);
for(const bytes of [original.subarray(0,-1),Buffer.from('invalid'),drawing([encodedStroke({version:101})]),
  drawing([encodedStroke({spec:2})]),drawing([encodedStroke({style:1})]),drawing([encodedStroke({width:NaN})]),drawing([encodedStroke({width:0})]),
  drawing([encodedStroke({points:[[0,0,0],[2,1,1]]})]),Buffer.concat([original,Buffer.from([1])])]) {
  assert.throws(()=>api.decodeStrokes(bytes));
}
const oversized=Buffer.from(original);oversized.writeUInt32BE(0xffffffff,41);
assert.throws(()=>api.decodeStrokes(oversized));
// Derive nested group bounds in each group's coordinates, including rotation.
const records=new Map([
 [1,{id:1,parent:-1,matrix:[1,0,0,1,0,0],opacity:.5}],
 [2,{id:2,parent:1,matrix:[1,0,0,1,20,30],opacity:.5}],
 [3,{id:3,parent:2,matrix:[0,1,-1,0,5,7],opacity:.8}],
 [4,{id:4,parent:-1,matrix:[1,0,0,1,0,0],opacity:1}]
]);
const items=[{id:1,kind:'group',opacity:.5},{id:2,kind:'group',opacity:.5},
 {id:3,kind:'image',opacity:.8,clip:{x:0,y:0,width:10,height:20}},{id:4,kind:'group',opacity:1}];
const result=api.finishGroups(items,records);
assert.deepEqual(result.map(x=>x.id),[1,2,3]);
assert.deepEqual(plain(result[1].bounds),{x:-25,y:-3,width:40,height:30});
assert.deepEqual(plain(result[0].bounds),{x:-15,y:17,width:60,height:50});
assert.equal(result[1].opacity,.25);
assert.equal(result[2].opacity,.2);
console.log('PASS: stroke curves, colors, bounds, empty/malformed records, nested/rotated groups and inherited opacity.');
