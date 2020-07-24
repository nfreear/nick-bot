/**
 * Embed a radio player :~ https://www.radio.net/search?p=2&q=BBC%20Radio
 *
 * @TODO  Move 'station' regex into NLP / NER !
 *
 * @author  NDF, 21-Feb-2020.
 */

const { PluginBase, defaultContainer } = require('../plugin-base');

const RADIO_URL = [
  'https://www.radio.net/inc/microsite/',
  '?playStation=bbcradio2',
  '&playerWidth=360px&playerHeight=92px',
  '&playerColor=61ce42',
  '&autoplay=false',
  '&apikey=df04ff67dd3339a6fc19c9b8be164d5b5245ae93',
  '&playerType=web_embedded',
  '&partnerLogo=null&partnerUrl=null&partnerBacklink=null&partnerName=null&popoutTitle=null&stations=null',
  '&listText=null&listSubtext=null&showFooter=null&token=null&popupWidth=null&popupHeight=null&iframe=true'
];

const RADIO_STATIONS = {
  bbcradio1: 'BBC Radio 1',
  bbcradio2: 'BBC Radio 2',
  bbcradio3: 'BBC Radio 3',
  bbcradio4: 'BBC Radio 4',
  bbcradio5: 'BBC Radio 5',

  bbcradio1xtra: 'BBC Radio 1xtra',
  bbcradio4extra: 'BBC Radio 4 Extra',
  bbcradio4lw: 'BBC Radio 4 long wave',
  bbcradio5live: 'BBC Radio 5 Live',
  bbcradio6music: 'BBC Radio 6 Music',

  bbcworldservice: 'BBC World Service',
  bbcworldservicearabic: 'BBC World Service Arabic',

  bbcthreecounties: 'BBC Three Counties Radio',

  classicfm: 'Classic FM',
  jazzfm: 'Jazz FM UK',
  heartlondon: 'Heart London',
  radiojackie: 'Radio Jackie', // Pirate!

  unionjack: 'Union Jack', // https://www.unionjack.co.uk/
  coffeebreakspanish: 'Coffee Break Spanish' // Podcasts!
};

const RADIO_STATION_REGEXS = [
  {
    id: 'BBC radio numbers',
    re: /(Radio\s*[1-6]\s*(e?xtra|Live|Lw|Music)?)/i,
    prefix: 'bbc'
  }, {
    id: 'BBC world service',
    re: /(BBC\s*World\s*Service\s*(Arabic)?)/i,
    prefix: ''
  }, {
    id: 'Other',
    re: /(Classic\s*FM|Jazz\s*FM|Heart\s*London|Union\s*Jack)/i,
    prefix: ''
  }
];

class RadioPlayer extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.name = 'radioPlayer';
  }

  run (input) {
    this.logger.info(this.name, '.run()');

    let answer = `Sorry, I didn't recognise the radio station: "_${input.utterance}_"
      ... try: "_Get Radio 2_"`;

    RADIO_STATION_REGEXS.forEach(station => {
      const match = input.utterance.match(station.re);

      if (match) {
        const stationId = station.prefix + match[1].replace(/\s+/g, '').toLowerCase();

        this.logger.info('Radio ~ match:', match);

        if (stationId in RADIO_STATIONS) {
          const stationName = RADIO_STATIONS[stationId];
          const embedUrl = RADIO_URL.join('').replace('bbcradio2', stationId);
          const embedMarkdown = `[${stationName} - radio.net](${embedUrl}#!_EMBED_)`;

          answer = embedMarkdown;
        }
      }
    });

    input.text = input.answer = answer;

    return input;
  }
}

module.exports = RadioPlayer;
