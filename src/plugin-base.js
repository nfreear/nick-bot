/**
 * Add `logToFile` function etc. to `Clonable` for plugins.
 *
 * @author  NDF, 19-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/tree/master/examples/01-container
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
// const { request } = require('@nlpjs/request');
const fs = require('fs');
const path = require('path');

// https://github.com/HackerYou/json-proxy
// https://rss2json.com/plans
const XML_TO_JSON_URL = 'https://proxy.hackeryou.com/?xmlToJSON=true&reqUrl=%s'; // https://weather-broker-cdn.api.bbci.co.uk/en/observation/rss/2643123

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

    // this.container.register('request', request);

    // this.logger.info(this);
  }

  requestFeedToJson (feedUrl) {
    const request = this.container.get('request');
    const requestUrl = XML_TO_JSON_URL.replace(/%s/, feedUrl);

    const promise = request.get(requestUrl);

    return promise; // .contents;
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
