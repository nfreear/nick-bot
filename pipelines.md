# default

## main
nlp.train
console.say "Say something!"

## x-ner-trim-only
console.say "x-ner-trim-only !"

## ner-process
console.say "ner-process !"

## onIntent(weather.inPlaceName)
placenameEntity
weatherIntent
output.text

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
