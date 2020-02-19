/**
 * Parse place-nome / location entities - 'Named Entity Recognition' (NER).
 *
 * @see https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities
 * @see https://github.com/axa-group/nlp.js/blob/master/packages/ner/src/ner.js#L52
 * @author NDF, 15-Feb-2020.
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
const {
  ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

const fs = require('fs');
const path = require('path');

class PlacenameEntity extends Clonable {
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

    const logger = this.container.get('logger');
    logger.info('PlacenameEntity.init() !', this); // this.ner.toJSON());
  }

  async placenameEntity (input) {
    const result = await this.ner.process(input);

    this.logToFile(result);

    return result;
  }

  async run (input) {
    this.logToFile(input, 'raw-input.jsonl');

    const logger = this.container.get('logger');
    logger.info('PlaceNameEntity.run() !');

    return this.placenameEntity(input);
  }

  logToFile (input, fileName = 'placename-entity.jsonl') {
    const PATH = path.join(__dirname, '..', fileName);
    fs.writeFile(PATH, JSON.stringify([
      'PlacenameEntity', new Date().toISOString(), input
    ], null, 2), (err) => {
      if (err) console.error('Error.', err);
    });
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
