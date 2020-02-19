/**
 * @author NDF, 19-Feb-2020.
 * @see https://github.com/microsoft/BotFramework-WebChat/blob/master/docs/API.md
 */

const WebChat = window.WebChat;
const Event = window.Event;
const ChatElem = document.querySelector('#webchat');

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

    // console.debug('> Action:', action)

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

  if (data.from.role === 'bot' && data.type === 'message') {
    const messageText = data.text;

    window.setTimeout(() => {
      const $lastItem = ChatElem.querySelector('ul[ aria-live ] li:last-child');
      const $link = $lastItem.querySelector('a[ href ]');
      const $embeddable = $lastItem.querySelector('a[ href *= _EMBED_ME_ ]');

      if ($embeddable) {
        const url = $embeddable.getAttribute('href');
        const $container = $embeddable.parentElement;

        $container.innerHTML += `<iframe src="${url}" allowfullscreen>[ Loading ]</iframe>`;

        console.debug('> Embed:', $container, url);
      }

      console.debug(messageText, $link, $lastItem.innerText);
    }, 100);

  }
});

document.querySelector('#webchat > *').focus();
