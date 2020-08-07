// const path = require('path');
// const fs = require('fs');
const bodyParser = require('body-parser');

const bodyParserJson = bodyParser.json({ type: 'application/json' });

module.exports = {
  bodyParserJson,
};
