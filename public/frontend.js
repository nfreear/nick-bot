/**
 * @author NDF, 19-Feb-2020.
 * @see https://github.com/microsoft/BotFramework-WebChat/blob/master/docs/API.md
 */

import { BotSpeechSynth } from './lib/bot-speech-synth.js';

const WebChat = window.WebChat;
const Event = window.Event;
const ChatElem = document.querySelector('#webchat');

const synth = new BotSpeechSynth();

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

WebChat.renderWebChat(
  {
    directLine: WebChat.createDirectLine({
      domain: 'http://localhost:3000/directline',
      webSocket: false
    }),
    store,
    userID: 'Nick' // Was: 'Jesús'
  },
  ChatElem
);

window.addEventListener('webchatincomingactivity', ({ data }) => {
  console.log(`> Received an activity of type "${data.type}":`, data);

  if (isBotMessage(data)) {
    window.setTimeout(() => handleMessage(data.text), 50);
  }
});

function isBotMessage (data) {
  return data.from.role === 'bot' && data.type === 'message';
}

function handleMessage (inputText) {
  const $lastItem = ChatElem.querySelector('ul[ aria-live ] li:last-child');
  const $text = $lastItem.querySelector('.markdown');

  const action = tryAction($lastItem);
  tryEmbed($lastItem);

  synth.act($text, action);

  synth.speak($lastItem, inputText);
}

function tryAction ($lastItem) {
  const $actLink = $lastItem.querySelector('a[ href *= "!action=" ]');

  if ($actLink) {
    $actLink.addEventListener('click', ev => {
      ev.preventDefault();
      window.alert('(action)');
    });

    const actMatches = $actLink.getAttribute('href').match(/action=([a-z.]+)(?:;([a-z]+)=(\w*))?/i);

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

/* function param (regex, def = null) {
  const matches = window.location.href.match(regex);
  return matches ? matches[1] : def;
} */

document.querySelector('#webchat > *').focus();
