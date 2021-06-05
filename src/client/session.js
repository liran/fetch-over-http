const utils = require('../utils');

class Session {
  id = utils.random();

  url;

  options;

  locked = false;

  disturbed = false;

  resolve = null;

  promise = new Promise((resolve) => (this.resolve = resolve));

  constructor(url, options) {
    this.url = url;
    this.options = options;
  }

  abort = () => {
    if (this.disturbed) return;

    if (this.locked) {
      // cancel
      // https://stackoverflow.com/a/28796790
    }

    this.resolve(null);
  };

  bindConnection = (con) => {
    con.feed();
  };
}

module.exports = Session;
