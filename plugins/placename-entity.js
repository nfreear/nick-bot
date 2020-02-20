/**
 * Parse place-nome / location entities - 'Named Entity Recognition' (NER).
 *
 * @see https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities
 * @see https://github.com/axa-group/nlp.js/blob/master/packages/ner/src/ner.js#L52
 * @author NDF, 15-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');
const {
  ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

class PlacenameEntity extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.initNerManager();

    this.name = 'placenameEntity';
  }

  initNerManager () {
    const ner = this.ner = this.container.get('ner'); // Was: new Ner(); // Was: NerManager();

    ner.use(ExtractorTrim);
    ner.use(ExtractorEnum);
    ner.use(ExtractorRegex);
    ner.use(ExtractorBuiltin);

    ner.addAfterCondition('en', 'placeName', 'in');
    ner.addAfterCondition('en', 'placeName', 'for');

    /* ner.container.registerPipeline(
      'x-ner-trim-only',
      [
        '.decideRules',
        // 'extract-enum',
        // 'extract-regex',
        'extract-trim',
        // 'extract-builtin',
        // '.reduceEdges',
      ],
      false
    ); */

    // this.logger.info('PlacenameEntity.init() !', this);
  }

  async placenameEntity (input) {
    const result = await this.ner.process(input);

    this.logToFile(result);

    return result;
  }

  // Async / await does not work in a pipeline ?!
  async asyncRun (input) {
    this.logToFile(input, 'raw-input.jsonl');

    this.logger.info('PlaceNameEntity.run() !');

    return this.placenameEntity(input);
  }

  run (input) {
    this.logger.info('PlacenameEntity no-op!');

    return input;
  }
}

module.exports = PlacenameEntity;

/* Should these 'rules' go in 'conf.json' ??

  settings: {
      "tag": "ner"
  }
  "rules": {
    "en": {
      "placeName": {
        "name": "placeName",
        "type": "trim",
        "rules": [ {
            "type": "after",
            "words": [ "in", "for" ],
            "options": {}
          }
        ]
      }
    }
  }
*/
