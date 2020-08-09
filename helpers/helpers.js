// const path = require('path');
// const fs = require('fs');

const urlRegex = /^https?:\/\/(?:(?:\d{1,3}(?:\.\d{1,3}){1,3}\.\d{1,3}(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)(?:(?:\/[a-z0-9]+)+(?:\/|#|(?:\.[a-z0-9])+)?)?)|(?:(?:www\.)?[a-z0-9]+(?:(?:[-.][a-z0-9]+){1,}(?=\.))\.[a-z0-9]+)(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)?(?:(?:\/[A-z0-9]+){1,}(?:\/|#|(?:\.[A-z0-9]+))?)?)$/;

function controllerPromiseHandler(promise, req, res) {
  promise
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
}

module.exports = {
  urlRegex,
  controllerPromiseHandler,
};

// const bodyParser = require('body-parser');
// К сожалению, так не работало, так и не понял, почему.

// function bodyParserJson() {
//   bodyParser.json({ type: 'application/json' });
// }
