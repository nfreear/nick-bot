const { dockStart } = require('@nlpjs/basic');

(async () => {
  const dock = await dockStart();

  console.log('Dock:', dock, process.env.DOT_ENV_TEST);
})();
