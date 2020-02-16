/**
 * Parse place-nome / location entities - 'Named Entity Recognition' (NER).
 *
 * @see https://github.com/axa-group/nlp.js/blob/master/docs/v3/ner-manager.md#trim-named-entities
 * @see https://github.com/axa-group/nlp.js/blob/master/packages/ner/src/ner.js#L52
 * @author NDF, 15-Feb-2020.
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
const { Ner } = require('@nlpjs/ner');

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
    this.ner = new Ner(); // Was: NerManager(); // { threshold: 0.8 }

    this.ner.addAfterCondition('en', 'placeName', 'in');
    this.ner.addAfterCondition('en', 'placeName', 'for');

    /* const inLocationEntity = this.nerManager.addNamedEntity('inLocationEntity', 'trim');

    inLocationEntity.addAfterCondition('en', 'in');
    inLocationEntity.addAfterFirstCondition('en', 'for'); */

    const logger = this.container.get('logger');
    // logger.info(this.ner.toJSON());
  }

  async placenameEntity(input) {
    input.threshold = 0.8;

    // input.x_entity = this.ner.getEntitiesFromUtterance('en', input.utterance);
    input.x_entity = await this.ner.process(input);
    // input.x_entity = await this.nerManager.findEntities(input.utterance); // .then(result => input.x_entity = result);

    return input;
  }

  async run(input) {
    const logger = this.container.get('logger');
    logger.info(`PlaceNameEntity.run() !`);

    return await this.placenameEntity(input);
  }

}

module.exports = PlacenameEntity;


/* Should these 'rules' go in 'conf.json' ??

  settings: {
      "tag": "ner"
    }
    rules: {
      "en": {
        "placeName": {
          "name": "placeName",
          "type": "trim",
          "rules": [
            {
              "type": "after",
              "words": [
                "in"
              ],
              "options": {}
            },
            {
              "type": "after",
              "words": [
                "for"
              ],
              "options": {}
            }
          ]
        }
      }
    }
*/
