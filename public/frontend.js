/**
 * @author NDF, 19-Feb-2020.
 * @see https://github.com/microsoft/BotFramework-WebChat/blob/master/docs/API.md
 */

import { BotCustomSpeech } from './lib/bot-custom-speech.js';
// import { BotSpeechSynth } from './lib/bot-speech-synth.js';

const WebChat = window.WebChat;
const Event = window.Event;
const ChatElem = document.querySelector('#webchat');
const FOCUS_SEL = '#webchat > *';
const locale = param(/(?:lang|locale)=([a-z]{2}[-\w]*)/, 'en-GB');
// const speech = param(/(?:speech|tts)=(bf|1)/, false);

const speech = new BotCustomSpeech(locale);
// const synth = new BotSpeechSynth();

console.warn('Locale:', locale);

// We are adding a new middleware to customize the behavior of DIRECT_LINE/INCOMING_ACTIVITY.
// https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/04.api/c.incoming-activity-event
const store = WebChat.createStore(
  {},
  ({ dispatch }) => next => action => {
    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const event = new Event('webchatincomingactivity');

      event.data = action.payload.activity;
      window.dispatchEvent(event);
    }

    return next(action);
  }
);

const styleOptions = {
  botAvatarInitials: 'Bot',
  userAvatarInitials: 'Me',
  botAvatarBackgroundColor: '#0063B1',
  userAvatarBackgroundColor: '#0063B1',
  backgroundColor: '#333',
  accent: 'white'
};

WebChat.renderWebChat(
  {
    directLine: WebChat.createDirectLine({
      domain: 'http://localhost:3000/directline',
      webSocket: false
    }),
    locale,
    webSpeechPonyfillFactory: speech.speechPonyfill(),
    selectVoice: speech.selectVoice,
    styleOptions,
    store,
    userID: 'Nick' // Was: 'Jesús'
  },
  ChatElem
);

window.addEventListener('webchatincomingactivity', ({ data }) => {
  console.log(`> Received an activity of type "${data.type}":`, data);

  if (isBotMessage(data)) {
    /* if (data.attachments && data.attachments[0].contentType.match(/app.+json/)) {
      console.log(`> JSON attachment:`, data.attachments[0]);
    } */
    window.setTimeout(() => handleMessage(data.text), 50);
  }
});

function isBotMessage (data) {
  return data.from.role === 'bot' && data.type === 'message';
}

function handleMessage (inputText) {
  const $lastItem = ChatElem.querySelector('ul[ aria-live ] > li:last-child'); // Direct descendant!
  const $text = $lastItem.querySelector('.markdown');

  const action = tryAction($lastItem);
  tryEmbed($lastItem);

  speech.act($text, action, locale);

  speech.speak($lastItem, inputText, locale);
}

function tryAction ($lastItem) {
  const $actLink = $lastItem.querySelector('a[ href *= "!action=" ]');

  if ($actLink) {
    $actLink.addEventListener('click', ev => {
      ev.preventDefault();
      window.alert('(action)');
    });

    const actMatches = $actLink.getAttribute('href').match(/action=([a-z.]+)(?:;([a-z]+)=([\w-]*))?/i);

    if (actMatches) {
      const action = {
        action: actMatches[1],
        paramName: actMatches[2] || null,
        param: actMatches[3] || null
      };
      console.warn('Action:', action);

      return action;
    }
  }
  return {
    action: null,
    param: null
  };
}

function tryEmbed ($lastItem) {
  const $embed = $lastItem.querySelector('a[ href *= _EMBED_ ]');

  if ($embed) {
    const url = $embed.getAttribute('href');
    const text = $embed.innerText;
    const $container = $embed.parentElement;

    $container.innerHTML += `<iframe src="${url}" title="Embed: ${text}" allowfullscreen ></iframe>`;

    console.debug('> Embed:', $container, url);
  }
}

function param (regex, def = null) {
  const matches = window.location.href.match(regex);
  return matches ? matches[1] : def;
}

document.querySelector(FOCUS_SEL).focus();
