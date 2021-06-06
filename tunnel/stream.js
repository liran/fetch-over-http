const streams = require('web-streams-polyfill/ponyfill/es6');

module.exports = {
  ReadableStream: this.ReadableStream || streams.ReadableStream,
  WritableStream: this.WritableStream || streams.WritableStream,
  TransformStream: this.TransformStream || streams.TransformStream,
};
