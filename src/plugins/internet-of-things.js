/**
 * Internet of things ~~ control devices, including TP-Link smart plug(s).
 *
 * @author Nick Freear, 14-Jul-2020.
 */

const { login } = require('tplink-cloud-api');
const { PluginBase, defaultContainer } = require('../plugin-base');

class InternetOfThings extends PluginBase {
  constructor (settings = {}, container) {
    super({
      settings: {},
      container: settings.container || container || defaultContainer
    },
    container
    );

    this.tplinkLogin();

    this.name = 'internetOfThings';
  }

  tplinkLogin () {
    const { TP_LINK_USER, TP_LINK_PASS } = process.env;

    this.tplink = null;
    // this.device = null;

    login(TP_LINK_USER, TP_LINK_PASS).then(tplink => {
      console.log('IoT: TPLink.', 'Logged in OK:', tplink.getTermId(), tplink.getToken());

      this.tplink = tplink;

      return tplink.getDeviceList();
    })
      .then(deviceList => {
        console.log('IoT: TPLink.', 'Device list:', deviceList);

        // this.device = this.tplink.getHS100(TP_LINK_DEV);
      });
  }

  run (input) {
    this.logger.info(`${this.name}.run()`);

    const { IOT_DEVICE_ALIAS } = process.env;

    let answer = `Sorry, I didn't recognise "_${input.utterance}_"
      … try: "_Turn plug A on_"`;

    try {
      const DEVICE = this.tplink.getHS100(IOT_DEVICE_ALIAS);

      if (/ on( |$)/i.test(input.utterance)) {
        answer = `Switching device “_${IOT_DEVICE_ALIAS}_” ON.`;

        DEVICE.powerOn();
      } else if (/ off( |$)/i.test(input.utterance)) {
        answer = `Switching device “_${IOT_DEVICE_ALIAS}_” OFF.`;

        DEVICE.powerOff();
      }
    } catch (err) {
      console.error('ERROR (IoT).', err);
      answer = `Sorry, there was a problem with IoT device “_${IOT_DEVICE_ALIAS}_”.`;
    }

    input.text = input.answer = answer;

    return input;
  }
}

module.exports = InternetOfThings;
