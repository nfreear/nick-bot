
window.WebChat.renderWebChat(
  {
    directLine: window.WebChat.createDirectLine({
      domain: 'http://localhost:3000/directline',
      webSocket: false
    }),
    userID: 'Nick' // Was: 'Jesús'
  },
  document.getElementById('webchat')
);
