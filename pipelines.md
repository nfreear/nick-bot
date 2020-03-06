# default

## main
nlp.train
console.say "Say something!"

## onIntent(weather.test)
// compiler=javascript
const resp = request.get('https://proxy.hackeryou.com/?xmlToJSON=true&reqUrl=https://weather-broker-cdn.api.bbci.co.uk/en/observation/rss/2642465');
if (resp && resp.rss && resp.rss.channel) {
  input.answer = 'MK weather: ' + resp.rss.channel.item.description;
}

## onIntent(weather.inPlaceName)
x-normalize
placenameEntity
weatherIntent
->output.text

## onIntent(speech.synthesis.on)
speechControl
->output.text

## onIntent(speech.synthesis.off)
speechControl
->output.text

## onIntent(speech.synthesis.listVoices)
speechControl
->output.text

## onIntent(echo.bot)
echoBot
->output.text

## onIntent(embed.radio)
x-normalize
radioPlayer
->output.text

## onIntent(disability.declare)
x-normalize
disabilityClassifier
->output.text

## onIntent(agent.version)
agentVersion
->output.text

## onIntent(quote.of.the.day)
// compiler=javascript
const resp = request.get('https://quotes.rest/qod?language=en');
if (resp && resp.contents.quotes[ 0 ]) {
  input.answer = '"' + resp.contents.quotes[ 0 ].quote + '" via [TheSaidSo](https://theysaidso.com)';
}

## onIntent(joke.chucknorris)
// compiler=javascript
const something = request.get('http://api.icndb.com/jokes/random');
if (something && something.value && something.value.joke) {
  input.answer = something.value.joke;
}

## console.hear
// compiler=javascript
if (message === 'quit') {
  return console.exit();
}
nlp.process();
this.say();
