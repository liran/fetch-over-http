const { TransformStream } = require('./stream');
const utils = require('./utils');

class Response {
  id = utils.random();

  headers = {};

  body = null;

  fetchBodyWriter = null;

  ResponseStreamWriter = null;

  constructor() {
    const { readable, writable } = new TransformStream();
    this.responseData.body = readable;
    this.ResponseStreamWriter = writable.getWriter();
  }

  status = (status) => {
    this.responseData.status = status;
  };

  setHeader = (key, val) => {
    this.responseData.headers[key] = val;
  };

  sendHeaders = () => {
    if (this.headersSent) return;
    this.headersSent = true;
  };

  write = (chunk = []) => {
    console.log(chunk);
    this.ResponseStreamWriter.write(chunk);
  };

  end = () => {
    this.ResponseStreamWriter.close();
  };
}

module.exports = { Response };
