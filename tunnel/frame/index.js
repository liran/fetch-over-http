const byteify = require('byteify');
const { BaseFrame } = require('./base');
const { HeaderFrame } = require('./header');

function buildFrame(bytes = []) {
  const type = bytes.splice(0, 1); // 1 byte
  const id = byteify.deserializeUint32(bytes.splice(0, 4)); // 4 byte
  const bodyLength = bytes.splice(0, 4); // 4 byte
  const body = bytes.splice(0, bodyLength);

  let frame;
  switch (type) {
    case HeaderFrame.type:
      frame = new HeaderFrame(id);
      if (!frame.parse(body)) frame = undefined;
      break;
    default:
      break;
  }

  return frame;
}

function canBuildFrame(bytes = []) {
  if (this.buffer.length < BaseFrame.headerLength) return false;

  const bodyLength = byteify.deserializeUint32(bytes.slice(5, 9)); // 4 byte, read the frame data length
  const frameLength = BaseFrame.headerLength + bodyLength;
  return bytes.length >= frameLength;
}

module.exports = { buildFrame, canBuildFrame };
