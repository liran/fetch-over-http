const Client = require('../src/client');

async function run() {
  const client = new Client({ servers: [{ host: 'localhost', port: 8000, https: false }] });
  const session = await client.request('https://wwww.baidu.com');
  if (!session) throw new Error('Unable to connect to remote server');
  const res = await session.promise;
  console.log(res);
}

run();
