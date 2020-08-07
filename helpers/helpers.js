// const path = require('path');
// const fs = require('fs');

function controllerPromiseHandler(promise, req, res) {
  promise
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  controllerPromiseHandler,
};

// const bodyParser = require('body-parser');
// К сожалению, так не работало, так и не понял, почему.

// function bodyParserJson() {
//   bodyParser.json({ type: 'application/json' });
// }
