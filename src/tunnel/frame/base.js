const byteify = require('byteify');

class BaseFrame {
  type;

  id;

  length = 0;

  index = 0;

  bytes = null;

  serialize = () => {
    return new Uint8Array([
      this.type,
      ...byteify.serializeUint32(this.id),
      ...byteify.serializeUint32(this.length),
      ...(this.bytes || []),
    ]);
  };

  fill = (chunk = []) => {
    let index = 0;
    if (!this.type) {
      this.type = chunk[0]; // 1 byte
      this.id = byteify.deserializeUint32(chunk.slice(1, 5)); // 4 byte
      this.length = byteify.deserializeUint32(chunk.slice(5, 9)); // 4 byte
      index = 9;
      if (this.length <= 0) return chunk.slice(index);
      this.bytes = new Uint8Array(this.length);
    }

    const end = index + this.length - this.index;
    const sub = chunk.slice(index, end);
    this.bytes.set(sub, this.index);

    // 如果还有剩余，把剩下的返回回去，否则返回 null
    this.index += sub.length;
    if (this.index === this.length) return chunk.slice(end);
    return null;
  };
}

module.exports = BaseFrame;
