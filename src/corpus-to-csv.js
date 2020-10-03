/**
 * Convert a corpus JSON file for NLP.js into a comma-separated (CSV) spreadsheet.
 *
 * @author NDF, 29-Sep-2020.
 */

const fs = require('fs');
const { join } = require('path');

const CORPORA = require('../conf.json').settings.nlp.corpora;
const COMMA = ',';

console.warn('Corpora:', CORPORA);

CORPORA.forEach((corpus, idx) => {
  const CORPUS_JSON = join(__dirname, '..', corpus);
  const CORPUS_CSV = CORPUS_JSON + '.csv';

  try {
    corpusToCsv(CORPUS_JSON, CORPUS_CSV, idx + 1);
  } catch (err) {
    console.error('ERROR', err);
  }
});

async function corpusToCsv (jsonFilePath, csvFilePath, idx) {
  const sep = COMMA;
  const csvData = [`ID${sep}Intent${sep}Utterance${sep}Answer${sep}Opts${sep}X-Pinyin${sep}`];

  const JSON_DATA = await fs.promises.readFile(jsonFilePath, 'utf8');
  const CORPUS = JSON.parse(JSON_DATA);

  CORPUS.data.forEach(item => {
    const INTENT = item.intent;
    const ID = item.id || '';

    item.utterances.forEach(utterance => { csvData.push(`${ID}${sep}${INTENT}${sep}"${utterance}"${sep}${sep}`); });

    if (item.answers) {
      item.answers.forEach(answer => {
        if (typeof answer === 'string') {
          csvData.push(`${ID}${sep}${INTENT}${sep}${sep}"${answer}"${sep}`);
        } else {
          csvData.push(`${ID}${sep}${INTENT}${sep}${sep}"${answer.answer}"${sep}${answer.opts || ''}${sep}`);
        }
      });
    }

    if (item['x-pinyin']) {
      item['x-pinyin'].forEach(pinyin => {
        csvData.push(`${ID}${sep}${INTENT}${sep}${sep}${sep}"${pinyin}"`);
      });
    }
  });

  await fs.promises.writeFile(csvFilePath, csvData.join('\n'));

  console.warn(`${idx}. Input file:     `, jsonFilePath);
  console.warn('   Locale:         ', CORPUS.locale);
  console.warn('   Count intents:  ', CORPUS.data.length);
  console.warn('   Count CSV lines:', csvData.length);
}
