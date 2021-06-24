class Channel {
  buffer = [];

  highWaterMark = 250 * 1024;

  readSize = 20 * 1024;

  waitRead = null;

  waitWrite = null;

  complete = false;

  constructor(highWaterMark) {
    if (highWaterMark) this.highWaterMark = highWaterMark;
  }

  write = (chunk) => {
    if (chunk) {
      this.buffer.push(...chunk);
    } else {
      this.complete = true;
    }

    if (this.waitRead) {
      this.waitRead();
      this.waitRead = null;
    }

    if (!this.complete && this.buffer.length >= this.highWaterMark) {
      return new Promise((resolve) => {
        this.waitWrite = resolve;
      });
    }
  };

  read = () => {
    if (!this.complete && this.buffer.length === 0) {
      return new Promise((resolve) => {
        this.waitRead = () => {
          const chunk = this.buffer.splice(0, this.readSize);
          resolve({ done: this.isDone(), chunk });
        };
      });
    }

    const chunk = this.buffer.splice(0, this.readSize);
    if (this.waitWrite) {
      this.waitWrite();
      this.waitWrite = null;
    }
    return { done: this.isDone(), chunk };
  };

  isDone = () => this.complete && this.buffer.length === 0;

  reset = () => {
    if (this.waitWrite) {
      this.waitWrite();
      this.waiting = null;
    }

    if (this.waitRead) {
      this.waitRead();
      this.waitRead = null;
    }

    this.buffer = [];

    this.complete = false;
  };
}

module.exports = Channel;
