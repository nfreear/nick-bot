/**
 * Parse place-nome / location entities - 'Named Entity Recognition' (NER).
 *
 * @see https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities
 * @see https://github.com/axa-group/nlp.js/blob/master/packages/ner/src/ner.js#L52
 * @author NDF, 15-Feb-2020.
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
const {
   Ner, ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

const fs = require('fs');
const path = require('path');

class PlacenameEntity extends Clonable {

  constructor(settings = {}, container) {
    super({
        settings: {},
        container: settings.container || container || defaultContainer,
      },
      container
    );

    this.initNerManager();

    this.name = 'placenameEntity';
  }

  initNerManager() {
    const ner = this.ner = this.container.get('ner');
    // this.ner = new Ner(); // Was: NerManager(); // { threshold: 0.8 }

    ner.use(ExtractorTrim);
    ner.use(ExtractorEnum);
    ner.use(ExtractorRegex);
    ner.use(ExtractorBuiltin);

    ner.addAfterCondition('en', 'placeName', 'in');
    ner.addAfterCondition('en', 'placeName', 'for');

    const logger = this.container.get('logger');
    // logger.info(this.ner.toJSON());
  }

  async placenameEntity(input) {
    const result = await this.ner.process(input);

    this.logToFile(result);

    return result;
  }

  async run(input) {
    const logger = this.container.get('logger');
    logger.info(`PlaceNameEntity.run() !`);

    return await this.placenameEntity(input);
  }

  logToFile(input) {
    const PATH = path.join(__dirname, '..', 'placename-entity.jsonl');
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
