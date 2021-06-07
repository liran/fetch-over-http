const FrameManager = require('./frame');
const Context = require('./context');
const { TransformStream } = require('./stream');
const { createCork } = require('./utils');

class Tunnel {
  sessions = {};

  listen = {};

  fm = new FrameManager();

  highWaterMark = 250; // frame counts

  frames = [];

  uncork = null;

  constructor({ highWaterMark = 250 }) {
    this.highWaterMark = highWaterMark;
  }

  readChunk = async (reader) => {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) {
        this.onClose();
        return;
      }

      const frames = this.fm.push(value);

      this.frames.push(...frames);

      // check frame invalid
      // to do

      if (this.frames.length >= this.highWaterMark) {
        const c = createCork();
        this.uncork = c.uncork;
        await c.cork();
      }

      // for (const item of frames) {
      //   this.onFrame(item);
      // }
    }
  };

  onHeaderFrame = (frame) => {
    const id = frame.id;
    if (!this.sessions[id]) {
      const ctx = new Context();
      try {
        const text = new TextDecoder().decode(frame.bytes);
        const opts = JSON.parse(text);
        ctx.headers = opts.headers || {};
        ctx.url = opts.url;
        ctx.method = opts.method || 'GET';
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
          const { readable, writable } = new TransformStream();
          ctx.body = readable;
          ctx.fetchBodyWriter = writable.getWriter();
        }

        this.sessions[id] = ctx;
        if (this.listen.fetch instanceof Function) this.listen.fetch(ctx);
      } catch (error) {
        console.error(error);
      }
    }
  };

  onFrame = (frame) => {
    switch (frame.type) {
      case 0x1: // header
        this.onHeaderFrame();
        break;
      default:
        break;
    }
  };

  on = (type, cb) => {
    this.listen[type] = cb;
  };

  onClose = () => {
    console.log('normal close tunnel');
  };

  fetch = (url, options) => {};

  suck = (readable) => {
    const reader = readable.getReader();
    this.readChunk(reader);
  };

  pipe = (writable) => {};
}

module.exports = Tunnel;
