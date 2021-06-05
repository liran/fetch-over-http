const _ = require('lodash');
const Connection = require('./connection');
const Session = require('./session');

const defaultsOpts = { age: 50, servers: [] };

class Client {
  opt = {};

  pool = []; // connections

  constructor(options = {}) {
    this.opt = { ...defaultsOpts, ...options };
  }

  createConn = async () => {
    const con = new Connection(this.onConnectionDestroy);
    const server = _.sample(this.opt.servers);
    const success = await con.connect(server);
    if (!success) return null;
    return con;
  };

  onConnectionDestroy = (con) => {
    _.remove(this.pool, (item) => item === con);
  };

  request = async (url, options) => {
    const session = new Session(url, options);

    let con = _.find(this.pool, (item) => item.usage < this.opt.age && !item.destroyed);
    if (!con) {
      con = await this.createConn();
      if (!con) return null;
      this.pool.push(con);
    }

    session.bindConnection(con);

    return session;
  };
}

module.exports = Client;
