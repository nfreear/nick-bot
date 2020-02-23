/**
 * Speech controller.
 *
 * @author  NDF, 23-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../src/plugin-base');
const {
  ExtractorTrim, ExtractorEnum, ExtractorRegex, ExtractorBuiltin
} = require('@nlpjs/ner');

class SpeechControl extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.initNerManager();

    this.name = 'speechControl';
  }

  initNerManager () {
    const ner = this.ner = this.container.get('ner');

    ner.use(ExtractorTrim);
    ner.use(ExtractorEnum);
    ner.use(ExtractorRegex);
    ner.use(ExtractorBuiltin);

    ner.addRegexRule('en', 'voiceName', /(?:voice|vox)\s*([a-z]+)/i);
  }

  run (input) {
    const topIntent = input.intent;
    const voice = this.getEntityValue(input, 'voiceName');
    const paramVox = voice ? voice.replace(/(voice|vox)\s*/, 'vox=') : '';

    this.logger.info(this.name, '.run():', topIntent, voice);

    this.logToFile(input);

    switch (topIntent) {
      case 'speech.synthesis.on':
        input.text = input.answer = `Speech on [(action)](#!action=tts.on;${paramVox})`;
        break;

      case 'speech.synthesis.off':
        input.text = input.answer = 'Speech off [(action)](#!action=tts.off;)';
        break;

      case 'speech.synthesis.listVoices':
        input.text = input.answer = 'List voices: [(action)](#!action=tts.listVox;)';
        break;

      default:
        this.logger.error('Error. Unexpected intent:', topIntent);
        break;
    }

    return input;
  }

  getEntityValue (input, entName, def = null) {
    const entity = input.entities.find(item => item.entity === entName);

    return entity ? entity.sourceText : def;
  }
}

module.exports = SpeechControl;
