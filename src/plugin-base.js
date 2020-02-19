/**
 * Add `logToFile` function etc. to `Clonable` for plugins.
 *
 * @author  NDF, 19-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/tree/master/examples/01-container
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
const fs = require('fs');
const path = require('path');

class PluginBase extends Clonable {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    // Not needed! this.logger = this.container.get('logger');

    this.name = 'PluginBase';

    this.logger.info(this);
  }

  logToFile (input, fileName) {
    fileName = fileName || this.name + '.jsonl';

    const PATH = path.join(__dirname, '..', 'data', fileName);

    fs.writeFile(PATH, JSON.stringify([
      fileName, new Date().toISOString(), input
    ], null, 2), (err) => {
      if (err) console.error('Error.', err);
    });
  }

  run (input) {
    this.logger.info(this.name, '.run() !');

    return input;
  }
}

module.exports = { PluginBase, defaultContainer };
