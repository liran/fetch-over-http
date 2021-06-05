const BaseFrame = require('./base');

class FrameManager {
  chunks = [];

  constructor(onFrame) {
    if (onFrame instanceof Function) this.onFrame = onFrame;
  }

  onFrame = (e) => e;

  push = (chunk = []) => {
    const last = this.chunks.length - 1;
    const lastChunk = this.chunks[last];
    if (lastChunk && lastChunk.length < 9) {
      this.chunks[last] = new Uint8Array([...lastChunk, ...chunk]);
    } else {
      this.chunks.push(chunk);
    }

    this.pack();
  };

  pack = () => {
    const frames = [];
    let bf = null;
    for (;;) {
      const item = this.chunks.shift();
      if (!item) break;

      if (!bf) bf = new BaseFrame();
      if (!bf.type && item.length < 9) break; // a frame min size is 9 byte

      const remain = bf.fill(item);
      if (!remain) continue;

      frames.push(bf);
      bf = null;
      if (remain.length > 0) {
        if (this.chunks[0]) {
          this.chunks[0] = new Uint8Array([...remain, ...this.chunks[0]]);
        } else {
          this.chunks.unshift(remain);
        }
      }
    }

    if (frames.length > 0) {
      for (const item of frames) {
        this.onFrame(item);
      }
    }
  };
}

module.exports = FrameManager;
