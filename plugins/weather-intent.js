/**
 * My first plugin!
 *
 * @TODO Integrate a weather forecast API ..?
 *       https://openweathermap.org/current#current_JSON
 *
 * @author  NDF, 13-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/tree/master/examples/01-container
 */

// const SAMPLE_WEATHER = require('../data/openweathermap.org-sample-data.json');

const { PluginBase, defaultContainer } = require('../src/plugin-base');

class WeatherIntent extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'weatherIntent';
  }

  weather (input) {
    input.text = input.answer = 'It looks like rain :( ! XX [Link](#hi)';
    input.answers.push({ answer: input.text });

    this.logToFile(input);

    return input;
  }

  /* join(input) {
    input.text = input.splitted.join('');
    return input;
  } */

  run (input) {
    const logger = this.container.get('logger');

    logger.info('WeatherIntent.run() !');

    return this.weather(input); // this.join(input.splitted ? input : { splitted: input });
  }
}

module.exports = WeatherIntent;
