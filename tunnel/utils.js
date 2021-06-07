function random() {
  return Math.floor(Math.random() * 100000000);
}

function createCork() {
  let uncork = null;
  const promise = new Promise((r) => {
    uncork = r;
  });
  return { cork: () => promise, uncork };
}

module.exports = { random, createCork };
