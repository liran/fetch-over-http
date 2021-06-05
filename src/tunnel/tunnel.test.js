const Tunnel = require('.');

const tunnel = new Tunnel();

tunnel.on('fetch', (ctx) => {
  const url = ctx.url;
  const method = ctx.method;
  const headers = ctx.headers;
  const body = ctx.body; // readable stream

  console.log(url, method, headers, body);
});
