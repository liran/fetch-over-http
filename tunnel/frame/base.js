const byteify = require('byteify');

class BaseFrame {
  static headerLength = 9;

  type;

  id;

  bytes = null;

  constructor(id, bytes) {
    this.id = id;
    this.bytes = bytes;
  }

  serialize = () => {
    const bytes = this.bytes || [];
    return new Uint8Array([
      this.type,
      ...byteify.serializeUint32(this.id),
      ...byteify.serializeUint32(bytes.length),
      ...bytes,
    ]);
  };
}

module.exports = { BaseFrame };
