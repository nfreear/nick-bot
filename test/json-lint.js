/**
 * Lint each JSON data-file using `jsonlint`.
 */

const PKG = require('../package');
const jsonlint = require('jsonlint');
const fs = require('fs');
const path = require('path');

const JSON_FILES = PKG.files.filter(file => /\.json$/.test(file));

JSON_FILES.forEach(async (jsonFile, idx) => {
  try {
    const PATH = path.join(__dirname, '..', jsonFile);
    const JSON = await fs.promises.readFile(PATH, 'utf8');

    const DATA = jsonlint.parse(JSON);
    const count = DATA.data ? DATA.data.length : DATA.feeds ? DATA.feeds.length : null;

    console.log(idx + 1, 'JSON file OK:', jsonFile, '~~ data count:', count);
  } catch (ex) {
    console.error(`>> ERROR in JSON file ${idx + 1}: '${jsonFile}'`);
    console.error(ex.message);

    process.exit(1);
  }
});
