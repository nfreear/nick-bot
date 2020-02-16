/**
 * My first plugin!
 *
 * @TODO Integrate a weather forecast API ..?
 *       https://openweathermap.org/current#current_JSON
 *
 * @author  NDF, 13-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/tree/master/examples/01-container
 */

const { defaultContainer, Clonable } = require('@nlpjs/core');
const fs = require('fs');
const path = require('path');

class WeatherIntent extends Clonable {

  constructor(settings = {}, container) {
    super({
        settings: {},
        container: settings.container || container || defaultContainer,
      },
      container
    );

    this.name = 'weatherIntent';
  }

  logToFile(input) {
    const PATH = path.join(__dirname, '..', 'weather-intent.jsonl');
    fs.writeFile(PATH, JSON.stringify([
      'WeatherIntent', new Date().toISOString(), input
    ], null, 2), (err) => {
      if (err) console.error('Error.', err);
    });
  }

  weather(input) {
    this.logToFile(input);

    input.text = input.answer = 'It looks like rain :( ! XX [Link](#hi)';

    return input;
  }

  /* join(input) {
    input.text = input.splitted.join('');
    return input;
  } */

  run(input) {
    const logger = this.container.get('logger');
    logger.info(`WeatherIntent.run() !`);

    this.logToFile(input);

    return this.weather(input); // this.join(input.splitted ? input : { splitted: input });
  }
}

module.exports = WeatherIntent;
