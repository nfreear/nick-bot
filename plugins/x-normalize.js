/**
 * Normalize the input.
 *
 * @author  NDF, 16-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/blob/master/docs/v4/core/normalizer.md
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');

class XNormalize extends Clonable {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'x-normalize';
  }

  removePunctuation (text) {
    return text.replace(/[^\w ']/g, '');
  }

  normalize (input) {
    const normalizer = this.container.get('normalize');

    const output = normalizer.run({ text: input.utterance, locale: input.locale });

    input.originalUtterance = input.utterance;
    input.utterance = this.removePunctuation(output.text);

    return input;
  }

  run (input) {
    const logger = this.container.get('logger');
    logger.info('XNormalize.run() !');

    return this.normalize(input);
  }
}

module.exports = XNormalize;
