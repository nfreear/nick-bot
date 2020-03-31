
[![Test status][gh-badge]][gh-link]

# nick-bot

An experimental Virtual assistant / Chat-bot, built on [NLP.js][], [Webchat][],
[Web APIs][web api] including `SpeechSynthesis`, and a [data][] collection.

```sh
npm install
npm test
npm start
npm run frontend
```

## Usage

> " Hello "
>
> " What's the weather doing in Cranfield? "
>
> " Give me radio 2 "
>
> " I have a stammer "
>
> " what version "
>
> " unmute voice ting-ting"
>
> " 回声你好世界 "

## Work-in-progress

 * Plugins: `weatherIntent`, `radioPlayer`, `speechControl`, `echoBot`;
 * Pipeline: `quote.of.the.day`;
 * Speech recognition (`ASR`), via WebChat's browser-based recognition;
 * Text-to-speech (`TTS`), via `speechSynthesis` browser/ [Web API][tts];
 * Dynamically switch `TTS` / synthesis voice, including to Chinese synthesisers;
 * Simplified Chinese corpus (`zh-CN`, `zh-Hans`);
 * Internationalization `i18n`;

## Todo

 * Localization;
 * Plugins: `translate`, `news`, `search`, `chinese-quotes` ...?
 * [Speech recognition][sr] via [Web API][];
 * ...?  

[data]: https://github.com/nfreear/data "@nfreear/data"
[quotes]: https://github.com/nfreear/quotes-data "@nfreear/quotes-data"
[nlp.js]: https://github.com/axa-group/nlp.js "NLP.js version 4.x"
[webchat]: https://github.com/Microsoft/BotFramework-WebChat
  "Microsoft Bot Framework Web Chat"
[web api]: https://developer.mozilla.org/en-US/docs/Web/API#Interfaces
  "For example, speech recognition / synthesis, location ..."
[sr]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
[tts]: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
[gh-badge]: https://github.com/nfreear/nick-bot/workflows/Node%20CI/badge.svg
[gh-link]: https://github.com/nfreear/nick-bot/actions "Test status ~ 'Node CI'"
[rel-badge]: https://img.shields.io/github/v/release/nfreear/nick-bot?include_prereleases
