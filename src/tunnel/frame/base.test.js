const byteify = require('byteify');
const HeaderFrame = require('./header');
const BaseFrame = require('./base');
const BodyFrame = require('./body');
const utils = require('../utils');

const options = {
  url: 'https://www.google.com/',
  method: 'POST',
  headers: { 'conent-type': 'application/json' },
};
const id = utils.random();
console.log('id:', id, ' s:', byteify.serializeUint32(id));
const headerFrame = new HeaderFrame(id, options);
const chunk = headerFrame.serialize();
console.log(chunk);

const chunks = [];
chunks.push(chunk.slice(0, 35));
chunks.push(chunk.slice(35));
chunks.push([2, 3, 207, 205, 217, 0, 0, 0, 0, 1]);
const bodyChunk = new BodyFrame(id, [1, 2, 3, 4, 5, 6, 7]).serialize().slice(1);
chunks.push(bodyChunk);

const frames = [];
let bf = null;
for (;;) {
  const item = chunks.shift();
  if (!item) break;

  if (!bf) bf = new BaseFrame();
  const remain = bf.fill(item);
  console.log('b:', !!remain);
  if (remain) {
    frames.push(bf);
    bf = null;
    if (remain.length > 0) {
      if (remain.length < 9 && chunks[0]) {
        chunks[0] = new Uint8Array([...remain, ...chunks[0]]);
      } else {
        chunks.unshift(remain);
      }
    }
  }
}

console.log('frames:', frames);
