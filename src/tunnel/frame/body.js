const BaseFrame = require('./base');

class BodyFrame extends BaseFrame {
  type = 0x2;

  constructor(id, chunk = []) {
    super();

    this.id = id;

    this.bytes = chunk;
    this.length = this.bytes.length;
  }
}

module.exports = BodyFrame;
