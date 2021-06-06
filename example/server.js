const http = require('http');
const Tunnel = require('../tunnel');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.write('');

  const tunnel = new Tunnel();
  tunnel.suck(req);
  tunnel.pipe(res);

  tunnel.on('fetch', (ctx) => {
    const url = ctx.url;
    const method = ctx.method;
    const headers = ctx.headers;
    const body = ctx.body; // readable stream

    console.log(url, method, headers, body);

    ctx.status(200);
    ctx.setHeader('content-type', 'application/json');
    ctx.sendHeaders();

    const te = new TextEncoder();
    ctx.write(te.encode(url));
    ctx.end();
  });
});

server.listen(8000);
