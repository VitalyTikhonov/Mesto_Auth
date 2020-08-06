const path = require('path');
const fs = require('fs');

function readFileAsset(fileName, res) {
  const readStream = fs.createReadStream(path.join(__dirname, '../data', fileName), { encoding: 'utf8' });
  readStream.on('error', () => {
    res.status(500).json({ error: 'На сервере произошла ошибка' });
  });
  return readStream;
}

function searchForUser(array, id) {
  return array.find((user) => user._id === id.toString());
}

function sendWholeJson(file, res) {
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  readFileAsset(file, res).pipe(res);
}

module.exports = {
  readFileAsset,
  searchForUser,
  sendWholeJson,
};
