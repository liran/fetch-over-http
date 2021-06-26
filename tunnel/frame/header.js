const { BaseFrame } = require('./base');

class HeaderFrame extends BaseFrame {
  static type = 0x1;

  type = HeaderFrame.type;

  data; // parsed data

  set = (o = {}) => {
    const te = new TextEncoder();
    this.bytes = te.encode(JSON.stringify(o));
  };

  parse = (bytes = []) => {
    try {
      const text = new TextDecoder().decode(bytes);
      this.data = JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  };
}

module.exports = { HeaderFrame };
