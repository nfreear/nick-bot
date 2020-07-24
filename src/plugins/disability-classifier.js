/**
 * Classify the user's disabilities, using the 'EnumExtractor'.
 *
 * @author NDF, 19-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../plugin-base');
const {
  ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

const DISABILITY_CATS = require('../hesa-plus-disability-categories-en');

class DisabilityClassifier extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.initNerManager();

    this.name = 'disabilityClassifier';
  }

  initNerManager () {
    const ner = this.ner = this.container.get('ner');

    ner.use(ExtractorTrim);
    ner.use(ExtractorEnum);
    ner.use(ExtractorRegex);
    ner.use(ExtractorBuiltin);

    const locale = DISABILITY_CATS.locale;
    const nameKey = DISABILITY_CATS.nameKey;

    DISABILITY_CATS.categories.forEach(cat => {
      const textList = cat.aliases ? cat.aliases.split(/,\s*/) : [];
      const categoryName = cat[nameKey];

      ner.addRuleOptionTexts(locale, categoryName, null, textList);
    });

    // ? ner.addAfterCondition(locale, 'disabilityUnknown', 'have');
    // ? ner.addAfterCondition(locale, 'disabilityUnknown', 'suffer from');

    this.logToFile(this.ner.toJSON(), 'disability-classifier-ner-rules.jsonl');

    this.logger.info('DisabilityClassifier.init() !'); // Was: , this)
  }

  run (input) {
    this.logger.info(this.name, '.run()');

    let answer = `Sorry, I don't recognise the disability or health condition: "_${input.utterance}_"`;

    if (input.entities.length) {
      const firstEntity = input.entities.length ? input.entities[0] : null;

      const disCat = firstEntity.entity;
      const disName = firstEntity.sourceText;

      answer = `OK. You've declared: ${disName} (${disCat}).`;
    }

    input.text = input.answer = answer;

    this.logToFile(input);

    return input;
  }
}

module.exports = DisabilityClassifier;
