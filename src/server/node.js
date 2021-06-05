const http = require('http');
const conHeaders = require('../connection.headers');

const server = http.createServer((req, res) => {
  console.log(req.headers);
  res.writeHead(200, conHeaders);
  res.write('');
});

server.listen(8000);
