const { Response } = require('./response');
const { TransformStream } = require('./stream');
const Channel = require('./channel');

class Tunnel {
  sessions = {};

  channel = new Channel();

  isServer = false;

  constructor({ isServer = false, readable, writable }) {
    this.isServer = isServer;

    const reader = readable.getReader();
    this.readChunk(reader);
  }

  readChunk = async (reader) => {
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) {
          this.onClose();
          return;
        }
        await this.channel.write(value);
      }
    } catch (error) {
      this.onError(error);
    }
  };

  distributeFrame = async () => {
    try {
      for (;;) {
        const frame = await this.channel.read();
      }
    } catch (error) {
      this.onError(error);
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

  onFetch = () => {};

  onError = (error) => {
    console.log(error);
  };

  onClose = () => {
    console.log('normal close tunnel');
  };

  fetch = (url, options) => {
    return new Promise((resolve, reject) => {
      const ctx = new Response();
    });
  };
}

module.exports = Tunnel;
