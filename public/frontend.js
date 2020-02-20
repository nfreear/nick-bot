/**
 * @author NDF, 19-Feb-2020.
 * @see https://github.com/microsoft/BotFramework-WebChat/blob/master/docs/API.md
 */

const WebChat = window.WebChat;
const Synth = window.speechSynthesis;
const Event = window.Event;
const ChatElem = document.querySelector('#webchat');
const useTts = window.location.search.match(/tts=1/);

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

function isBotMessage(data) {
  return data.from.role === 'bot' && data.type === 'message';
}

function handleMessage(inputText) {
  const $lastItem = ChatElem.querySelector('ul[ aria-live ] li:last-child');
  const $text = $lastItem.querySelector('.markdown');
  const $link = $lastItem.querySelector('a[ href ]');
  const $image = $lastItem.querySelector('img');
  const $embed = $lastItem.querySelector('a[ href *= _EMBED_ ]');

  tryEmbed($lastItem);

  let speech = '';
  speech += $embed ? 'Embed, ' : '';
  speech += $link ? 'Link, ' : '';
  speech += $image ? ('Image, ' + $image.getAttribute('alt')) : '';
  speech += $text.innerText;

  console.debug('Speak:', speech, inputText, $link);

  speak(speech);
}

function tryEmbed($lastItem) {
  const $embeddable = $lastItem.querySelector('a[ href *= _EMBED_ ]');

  if ($embeddable) {
    const url = $embeddable.getAttribute('href');
    const text = $embeddable.innerText;
    const $container = $embeddable.parentElement;

    $container.innerHTML += `<iframe src="${url}" title="Embed: ${text}" allowfullscreen ></iframe>`;

    console.debug('> Embed:', $container, url);
  }
}

function speak(inputText) {
  if (useTts) {
    const utterThis = new SpeechSynthesisUtterance(`${inputText}`); // Was: `Bot says:`
    Synth.speak(utterThis);
  }
}

document.querySelector('#webchat > *').focus();
