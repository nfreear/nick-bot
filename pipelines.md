# default

## main
nlp.train
console.say "Say something!"

## onIntent(weather.inPlaceName)
x-normalize
placenameEntity
weatherIntent
->output.text

## onIntent(disability.declare)
x-normalize
disabilityClassifier
->output.text

## onIntent(agent.version)
agentVersion
->output.text

## onIntent(quote)
// compiler=javascript
const resp = request.get('https://quotes.rest/qod?language=en');
if (resp && resp.contents.quotes[ 0 ]) {
  input.answer = resp.contents.quotes[ 0 ].quote;
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
