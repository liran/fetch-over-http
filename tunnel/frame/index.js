const BaseFrame = require('./base');

class FrameManager {
  bytes = [];

  push = (chunk = []) => {
    this.bytes.push(...chunk);

    return this.pack();
  };

  pack = () => {
    const frames = [];
    let bf = null;
    for (;;) {
      if (!bf) bf = new BaseFrame();
      if (!bf.type && this.bytes.length < 9) break; // a frame min size is 9 byte

      const remaining = bf.fill(this.bytes);
      this.bytes = remaining || [];
      if (!remaining) break;

      frames.push(bf);
      bf = null;
    }

    return frames;
  };
}

module.exports = FrameManager;
