const https = require('https');
const http = require('http');
const conHeaders = require('../connection.headers');
const FrameManager = require('../frame');

const agentConfig = { keepAlive: true, maxSockets: 256, timeout: 30000 };
const httpKeepAliveAgent = new http.Agent(agentConfig);
const httpsKeepAliveAgent = new https.Agent(agentConfig);

class Connection {
  usage = 0;

  response;

  fm = null;

  listen = {};

  destroyed = false;

  constructor() {
    this.fm = new FrameManager(this.onFrame);
  }

  feed = () => {
    this.usage++;
  };

  connect = (server = {}) => {
    return new Promise((resolve) => {
      const options = {
        hostname: server.host,
        port: server.port,
        method: 'POST',
        agent: server.https ? httpsKeepAliveAgent : httpKeepAliveAgent,
        headers: conHeaders,
      };
      const req = (server.https ? https : http).request(options);

      let hasReturn = false;
      const onResult = (result) => {
        if (hasReturn) return;
        hasReturn = true;
        resolve(result);
      };

      // socket connect timeout
      req.on('timeout', () => {
        onResult(false);
      });

      // client between server connceted
      // req.on('socket', (e) => {
      //   console.log(e);
      // });

      // server response header
      req.on('response', (res) => {
        onResult(true);
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);

        this.response = res;

        res.on('data', this.onResponeData);
        res.on('error', this.onResponseError);
      });

      req.write('');

      req.on('error', (e) => {
        console.error(e);
        onResult(false);
      });
    });
  };

  on = (id, type, cb) => {
    if (!this.listen[type]) this.listen[type] = {};
    this.listen[type][id] = cb;
  };

  onFrame = (frame) => {
    const id = frame.id;
    const cb = this.listen.frame?.[id];
    if (cb instanceof Function) cb(frame);
  };

  onResponseError = (err) => {
    console.log(err);
  };

  onResponeData = (chunk) => {
    console.log('onResponeData:', chunk);
    this.fm.push(chunk);
  };
}

module.exports = Connection;
