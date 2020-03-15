const { dockStart } = require('@nlpjs/basic');
// const MiddlewareInject = require('./src/middleware-inject');

(async () => {
  const dock = await dockStart();

  console.log('Dock:', dock, process.env.DOT_ENV_TEST);
})();
