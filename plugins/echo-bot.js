/**
 * An "echo bot"
 *
 * @author  NDF, 25-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');
const {
  ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

class EchoBot extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.initNerManager();

    this.name = 'echoBot';
  }

  initNerManager () {
    const ner = this.ner = this.container.get('ner');

    ner.use(ExtractorTrim);
    ner.use(ExtractorEnum);
    ner.use(ExtractorRegex);
    ner.use(ExtractorBuiltin);

    ner.addAfterCondition('en', 'echo', 'echo'); /** @TODO: not working ?! */
    ner.addAfterCondition('en', 'echo', 'say');
  }

  run (input) {
    this.logger.info(this.name, '.run()');

    const output = input.utterance.replace(/^(say|echo)/i, '').trim();

    input.text = input.answer = `Say: "${output}"`;

    this.logToFile(input);

    return input;
  }
}

module.exports = EchoBot;
