const byteify = require('byteify');
const utils = require('../src/utils');

const val = utils.random();
const serializedUint32 = byteify.serializeUint32(val);
const deserializedUint32 = byteify.deserializeUint32([0, 0, 0, 0]);
console.log(val, serializedUint32, deserializedUint32);

const bytes = new Uint8Array(3);
bytes[1] = 99;
console.log([...bytes]);

console.log(0x4);

const uint8 = new Uint8Array([10, 20, 30, 40, 50]);
const array1 = uint8.slice(3);
const buffer = new Uint8Array(10);
buffer.set(array1);
console.log(array1, buffer);

const enc = new TextEncoder(); // always utf-8
console.log(enc.encode('This is a string converted to a Uint8Array'));
