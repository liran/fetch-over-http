const http = require('http');
const byteify = require('byteify');
const Tunnel = require('../tunnel');
const { TransformStream } = require('../tunnel/stream');

// async function transformChunk(req, writable, readable) {
//   const writer = writable.getWriter();
//   req.on('response', (res) => {
//     res.on('data', (chunk) => {
//       writer.write(chunk);
//     });
//   });

//   const reader = readable.getReader();
//   for (;;) {
//     const { value, done } = await reader.read();
//     if (done) break;

//     req.write(value);
//   }
// }

function run() {
  const options = { hostname: 'localhost', port: 8000, method: 'POST' };
  const req = http.request(options);
  req.write(''); // trigger real connect

  const tunnel = new Tunnel();
  tunnel.pipe(req);

  req.on('response', (res) => {
    tunnel.suck(res);
  });

  // fetch A
  tunnel.fetch('https://wwww.baidu.com').then((res) => {
    console.log('A:', res);
  });

  // fetch B
  tunnel
    .fetch('https://wwww.jd.com', {
      method: 'POST',
      body: JSON.stringify({ name: 'liran', age: 18 }),
      headers: { 'content-type': 'application/json' },
    })
    .then((res) => {
      console.log('B:', res);
    });

  // fetch C
  const bodyStream = new TransformStream();
  let index = 100;
  const writer = bodyStream.writable.getWriter();
  const timer = setInterval(() => {
    if (--index < 0) clearInterval(timer);
    writer.write(byteify.serializeUint32(index));
  }, 200);

  tunnel
    .fetch('https://wwww.jd.com', {
      method: 'POST',
      body: bodyStream.readable,
      headers: { 'content-type': 'application/json' },
    })
    .then((res) => {
      console.log('C:', res);
    });
}

run();
