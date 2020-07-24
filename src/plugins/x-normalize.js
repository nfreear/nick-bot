/**
 * Normalize the input.
 *
 * @author  NDF, 16-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/blob/master/docs/v4/core/normalizer.md
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');

class XNormalize extends PluginBase {
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
    return text.replace(/[^\w ']/g, '').trim();
  }

  trimEndPunctuation (text) {
    return text.replace(/[^\w ']$/g, '').trim();
  }

  normalizeUtterance (input) {
    const normalizer = this.container.get('normalize');

    const output = normalizer.run({ text: input.utterance, locale: input.locale });

    // input.originalUtterance = input.utterance;
    input.normalizedUtterance = this.removePunctuation(output.text);

    return input;
  }

  normalizeEntities (input) {
    input.entities.forEach(entity => {
      entity.normalizedText = this.trimEndPunctuation(entity.utteranceText);
    });

    return input;
  }

  run (input) {
    const logger = this.container.get('logger');
    logger.info('XNormalize.run() !');

    input = this.normalizeUtterance(input);
    return this.normalizeEntities(input);
  }
}

module.exports = XNormalize;
