/**
 * Convert a corpus JSON file for NLP.js into a comma-separated (CSV) spreadsheet.
 *
 * @author NDF, 29-Sep-2020.
 */

const fs = require('fs');
const { join } = require('path');

const CORPUS_JSON = join(__dirname, '..', 'corpus-en.json');
const CORPUS_CSV = CORPUS_JSON + '.csv';

try {
  corpusToCsv(CORPUS_JSON, CORPUS_CSV);
} catch (err) {
  console.error('ERROR', err);
}

async function corpusToCsv (jsonFilePath = CORPUS_JSON, csvFilePath = CORPUS_CSV) {
  const csvData = [ 'Intent,Utterance,Answer,Opts,' ];

  const JSON_DATA = await fs.promises.readFile(jsonFilePath, 'utf8');
  const CORPUS = JSON.parse(JSON_DATA);

  CORPUS.data.forEach(item => {
    const INTENT = item.intent;

    item.utterances.forEach(utterance => { csvData.push(`${INTENT},"${utterance}",,`); });

    if (item.answers) {
      item.answers.forEach(answer => {
        if (typeof answer === 'string') {
          csvData.push(`${INTENT},,"${answer}",`);
        } else {
          csvData.push(`${INTENT},,"${answer.answer}",${answer.opts || ''},`)
        }
      });
    }
  });

  await fs.promises.writeFile(csvFilePath, csvData.join('\n'));

  console.warn('Input file:     ', jsonFilePath);
  console.warn('Locale:         ', CORPUS.locale);
  console.warn('Count intents:  ', CORPUS.data.length);
  console.warn('Count CSV lines:', csvData.length);
}
