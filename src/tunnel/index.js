const FrameManager = require('./frame');
const Context = require('./context');
const { TransformStream } = require('./stream');

class Tunnel {
  sessions = {};

  listen = {};

  readable = null;

  writable = null;

  fm = new FrameManager();

  constructor(readable, writable) {
    this.readable = readable;
    this.writable = writable;

    this.readChunk();
  }

  readChunk = async () => {
    const reader = this.readable.getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) {
        this.close();
        return;
      }

      const frames = this.fm.push(value);
      for (const item of frames) {
        this.onFrame(item);
      }
    }
  };

  onFrame = (frame) => {
    const id = frame.id;
    switch (frame.type) {
      case 0x1: // header
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
        break;
      default:
        break;
    }
  };

  on = (type, cb) => {
    this.listen[type] = cb;
  };

  close = () => {
    console.log('normal close tunnel');
  };
}

module.exports = Tunnel;
