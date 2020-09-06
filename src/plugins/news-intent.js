/**
 * Get news audio - BBC Minute, from World Service Radio.
 *
 * @author  Nick Freear, 05-Sep-2020.
 */

const { PluginBase, defaultContainer } = require('../plugin-base');

const BBC_MIN_SOUNDS_URL = 'https://www.bbc.co.uk/sounds/brand/p03q8kd9';
const BBC_MIN_AUDIO_URL = 'http://wsodprogrf.bbc.co.uk/bd/tx/bbcminute/mp3/bbcminute{YYMMDDHHMM}.mp3';
const P_HOLDER_DATE = '{YYMMDDHHMM}';

class NewsIntent extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'newsIntent';
  }

  run (input) {
    this.logger.info(this.name, '.run()');

    const DT = this.getBbcMinuteDateTime();

    const audioUrl = BBC_MIN_AUDIO_URL.replace(P_HOLDER_DATE, DT);
    const audioMarkdown = `Playing [BBC Minute on Sounds](${BBC_MIN_SOUNDS_URL})
      [BBC Minute — News headlines audio](${audioUrl}#!_AUDIO_)`;

    /* input.answers = [
      'Getting news headlines (BBC)...',
      audioMarkdown
    ]; */

    input.answer = audioMarkdown;

    this.logToFile(input);

    return input;
  }

  /* Convert :~  '2020-09-05T15:10:30.061Z'
   *   To    :~  '2009051500' (UTC not BST!)
   */
  getBbcMinuteDateTime () {
    const ISO = new Date().toISOString();

    const DT = ISO.replace(/^2\d/, '').replace(/:\d\d\.\d+Z/, ':').replace(/:\d\d:/, '00').replace(/[T:-]/g, '');
    return DT;
  }
}

module.exports = NewsIntent;
