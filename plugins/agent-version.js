/**
 * " What version am I ? "
 *
 * @author  NDF, 19-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');

const PKG = require('../package.json');
const LOCK = require('../package-lock.json');

class AgentVersion extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'agentVersion';
  }

  run (input) {
    this.logger.info(this.name, '.run()');

    const name = PKG.name;
    const version = PKG.version;
    const url = PKG.homepage || PKG.repository;
    // Was: const NLPJS = PKG.dependencies[ '@nlpjs/basic' ];
    const NLPJS = LOCK.dependencies['@nlpjs/core'].version;

    const answer = `I'm [${name} v${version}](${url}), using NLP.js v${NLPJS}.`;

    input.text = input.answer = answer;

    return input;
  }
}

module.exports = AgentVersion;
