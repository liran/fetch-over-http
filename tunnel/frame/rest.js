const BaseFrame = require('./base');

class RestFrame extends BaseFrame {
  type = 0x3;

  constructor(id) {
    super();

    this.id = id;
  }
}

module.exports = RestFrame;
