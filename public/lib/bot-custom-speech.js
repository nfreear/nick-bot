/**
 *
 * @author NDF, 15-Mar-2020.
 * @see https://github.com/microsoft/BotFramework-WebChat/blob/master/packages/bundle/src/createBrowserWebSpeechPonyfillFactory.js
 * @see https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/03.speech/g.hybrid-speech
 */

import { BotSpeechSynth } from './bot-speech-synth.js';

const WebChat = window.WebChat;

export class BotCustomSpeech {
  constructor (locale = 'en') {
    this.locale = locale;
    this.pSpeech = this.param(/[?&](?:speech|tts)=(bf|cbf|on|1)($|&|#)/, false);

    console.debug('BotCustomSpeech:', this.pSpeech, locale);
    this.synth = new BotSpeechSynth();
  }

  speechPonyfill () {
    const ponyfill = WebChat.createBrowserWebSpeechPonyfillFactory();

    if (this.useBF()) {
      console.debug('speechPonyfill: useBF', ponyfill);
      return ponyfill;
    } else if (this.useCustomBF()) {
      console.debug('speechPonyfill: useCustomBF', ponyfill);
      return () => ({
        SpeechGrammarList: ponyfill().SpeechGrammarList,
        SpeechRecognition: ponyfill().SpeechRecognition,

        speechSynthesis: null,
        SpeechSynthesisUtterance: null
      });
    }
    return null;
  }

  selectVoice (voices, activity) {
    console.warn('selectVoice:', activity);

    if (!activity.locale || /^en/.test(activity.locale)) {
      return voices.find(({ name }) => /(Fiona|Karen)/iu.test(name));
    }
  }

  act ($text, action, locale) {
    if (this.useCustomBF()) {
      this.synth.act($text, action, locale);
    }
  }

  speak ($lastItem, inputText, locale) {
    if (this.useCustomBF()) {
      this.synth.speak($lastItem, inputText, locale);
    }
  }

  isOn () {
    return this.pSpeech;
  }

  useBF () {
    return this.pSpeech && this.pSpeech === 'bf';
  }

  useCustomBF () {
    return this.pSpeech && this.pSpeech !== 'bf';
  }

  param (regex, def = null) {
    const matches = window.location.href.match(regex);
    // console.debug('Custom speech param:', matches);
    return matches ? matches[1] : def;
  }
}
