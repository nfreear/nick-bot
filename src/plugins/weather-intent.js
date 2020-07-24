/**
 * My first plugin!
 *
 * @TODO Integrate a weather forecast API ..?
 *       https://openweathermap.org/current#current_JSON
 *
 * @author  NDF, 13-Feb-2020.
 * @see  https://github.com/axa-group/nlp.js/tree/master/examples/01-container
 * @see  https://www.bbc.co.uk/weather/about/17543675
 */

// const SAMPLE_WEATHER = require('../data/openweathermap.org-sample-data.json');

const { BBC_WEATHER_LOCATIONS } = require('@nfreear/data');
const { PluginBase, defaultContainer } = require('../plugin-base');
const XRegExp = require('xregexp');

const BBC_WEATHER_URL = 'https://www.bbc.co.uk/weather';
const BBC_OBSERVATION_FEED_URL = 'https://weather-broker-cdn.api.bbci.co.uk/en/observation/rss/%s';

/* DELETE - const BBC_WEATHER_PLACES = {
  beijing: 1816670,
...
  yantai: 1787093
}; */

// 'Temperature: 3°C (38°F), Wind Direction: East South Easterly, Wind Speed: 6mph, Humidity: 85%, Pressure: 1002mb, Rising, Visibility: Very Good'
// 'Temperature: 5°C (41°F), Wind Direction: Northerly, Wind Speed: 17mph, Humidity: 100%, Pressure: 995mb, , Visibility: Moderate'
const BBC_OBSERVATION_XRE = XRegExp(`
  (?<temp>  Temperature:   [ ]-?\\d+°C )  [ .°]+
  (?<dir>   Wind Direction:[ \\w]+     )  ,[ ]
  (?<speed> Wind Speed:    [ ]\\d+mph  )  ,[ ]
  (?<humid> Humidity:      [ ]\\d+%    )  ,[ ]
  (?<press> Pressure:      [ ]\\d+mb,[ \\w]+) ,[ ]
  (?<visib> Visibility:    [ -\\w]+     )
`, 'xi');

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

  getBbcWeatherObservation (placeName) {
    return new Promise((resolve, reject) => {
      const location = BBC_WEATHER_LOCATIONS.data.find(loc => loc.en === placeName);

      if (location) { // Was: if (BBC_WEATHER_PLACES[placeName]) {
        const placeId = location.id; // BBC_WEATHER_PLACES[placeName];
        const feedUrl = BBC_OBSERVATION_FEED_URL.replace(/%s/, placeId);

        const promise = this.requestFeedToJson(feedUrl);

        return promise.then(resp => {
          const url = resp.rss.channel.link;
          const title = resp.rss.channel.title;
          const observations = resp.rss.channel.item.description;

          const answer = `[${title}](${url}) — ${observations}`;

          this.logger.info(answer);

          const match = XRegExp.exec(observations, BBC_OBSERVATION_XRE);
          this.logger.info('XRegExp:', match);
          /* `  - ${match.temp}
            - ${match.speed}
            - ${match.visib} `; */
          resolve({ answer, feedUrl, resp });
        });
      } else {
        resolve({
          answer: `Can't get weather for '${placeName}' ([Search location at BBC](${BBC_WEATHER_URL}#?q=${placeName})?)`

        });
      }
    });

    /* return Promise.resolve({
      answer: `Can't get weather for '${placeName}' ([missing location](${BBC_WEATHER_URL}))`
    }); */
  }

  weather (input) {
    const placeName = input.entities[0].normalizedText.toLowerCase();

    return new Promise((resolve, reject) => {
      const promise = this.getBbcWeatherObservation(placeName);

      return promise.then(resp => {
        input.text = input.answer = resp.answer;
        input.x_weather = resp;

        this.logToFile(input);

        resolve(input);
      });
    });
  }

  /* join(input) {
    input.text = input.splitted.join('');
    return input;
  } */

  run (input) {
    this.logger.info('WeatherIntent.run() !');

    return this.weather(input); // this.join(input.splitted ? input : { splitted: input });
  }
}

module.exports = WeatherIntent;
