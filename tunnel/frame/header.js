const BaseFrame = require('./base');

class HeaderFrame extends BaseFrame {
  type = 0x1;

  constructor(id, o = {}) {
    super();

    this.id = id;
    
    const te = new TextEncoder();
    this.bytes = te.encode(JSON.stringify(o));
    this.length = this.bytes.length;
  }
}

module.exports = HeaderFrame;
