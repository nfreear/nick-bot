/**
 * Browser speech synthesis (TTS), with "mute" / "unmute".
 *
 * @author  NDF, 23-Feb-2020.
 */

const Synth = window.speechSynthesis;
const Utterance = window.SpeechSynthesisUtterance;
const Query = window.location.search;

// const ESCAPE_KEY_CODE = 27;

export class BotSpeechSynth {
  constructor () {
    this.isOn = /tts=1/.test(Query);
    // this.voice;

    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') { // ev.keyCode === ESCAPE_KEY ||
        console.warn('Speech synth:', 'cancel', ev);

        Synth.cancel();
      }
    });
  }

  act ($domElem, action) {
    console.log('> Act:', action);

    switch (action.action) {
      case 'tts.on':
        this.isOn = true;
        this.switchVoice(action);
        break;
      case 'tts.off':
        this.isOn = false;
        Synth.cancel();
        break;
      case 'tts.listVox':
        var list = this.voiceList().join(', ');

        $domElem.innerHTML += `<ul><li><small> ${list} </small></li></ul>`;
        break;
    }
  }

  speak ($domElem, rawText) {
    if (this.isOn) {
      const speech = this.prepareSpeech($domElem);
      const utterThis = new Utterance(`${speech}`); // Was: `Bot says:`

      if (this.voice) {
        utterThis.voice = this.voice;
      }

      console.warn(`Speak: "${speech}"`);

      Synth.speak(utterThis);
    }
  }

  switchVoice (action, regex = /^en/) {
    const voices = Synth.getVoices().filter(vox => regex.test(vox.lang));
    const voxRegex = new RegExp(action.param, 'i');

    const result = voices.find(vox => voxRegex.test(vox.name));

    this.voice = result || this.voice;

    console.warn('> Switch voice:', this.voice ? this.voice.name : undefined);
  }

  voiceList (regex = /^en/) {
    const voices = Synth.getVoices().filter(vox => regex.test(vox.lang));
    console.warn('> Voices:', voices, regex);

    const voxNames = voices.map(vox => vox.name);

    return voxNames;
  }

  prepareSpeech ($domElem) {
    const $text = $domElem.querySelector('.markdown');
    const $link = $domElem.querySelector('a[ href ]');
    const $image = $domElem.querySelector('img');
    const $embed = $domElem.querySelector('a[ href *= _EMBED_ ]');

    let speech = '';
    speech += $embed ? 'Embed, ' : '';
    speech += $link ? 'Link, ' : '';
    speech += $image ? `Image: ${$image.getAttribute('alt')}, ` : '';
    speech += ($text || $domElem).innerText;

    return speech;
  }
}
