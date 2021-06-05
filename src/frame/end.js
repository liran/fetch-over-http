const BaseFrame = require('./base');

class EndFrame extends BaseFrame {
  type = 0x4;

  constructor(id) {
    super();

    this.id = id;
  }
}

module.exports = EndFrame;
