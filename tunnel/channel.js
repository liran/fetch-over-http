const { buildFrame, canBuildFrame } = require('./frame');

class Channel {
  buffer = [];

  frames = [];

  frameHighWaterMark = 10; // frame count

  waitRead = null;

  waitWrite = null;

  constructor(frameHighWaterMark) {
    if (frameHighWaterMark) this.frameHighWaterMark = frameHighWaterMark;
  }

  tryBuildFrame = () => {
    for (;;) {
      if (!canBuildFrame(this.buffer)) break;

      const frame = buildFrame(this.buffer); // length of the buffer will be changed
      if (frame) this.frames.push(frame);
    }
  };

  write = (chunk) => {
    this.buffer.push(...chunk);

    this.tryBuildFrame();

    if (this.frames.length < 1) return;

    if (this.waitRead) {
      this.waitRead();
      this.waitRead = null;
    }

    if (this.frames.length >= this.frameHighWaterMark) {
      return new Promise((resolve) => {
        this.waitWrite = resolve;
      });
    }
  };

  read = () => {
    const frame = this.frames.shift();

    if (this.waitWrite) {
      this.waitWrite();
      this.waitWrite = null;
    }

    if (frame) return frame;

    return new Promise((resolve) => {
      this.waitRead = () => resolve(this.frames.shift());
    });
  };

  reset = () => {
    this.buffer = [];
    this.frames = [];

    if (this.waitWrite) {
      this.waitWrite();
      this.waiting = null;
    }

    if (this.waitRead) {
      this.waitRead();
      this.waitRead = null;
    }
  };
}

module.exports = Channel;
