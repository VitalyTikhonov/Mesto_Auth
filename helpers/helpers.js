// const path = require('path');
// const fs = require('fs');

function controllerPromiseHandler(promise, req, res) {
  promise
    .then((respObj) => res.send({ data: respObj }))
    // .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
    .catch((err) => res.status(500).send(err));
}

module.exports = {
  controllerPromiseHandler,
};

// const bodyParser = require('body-parser');
// К сожалению, так не работало, так и не понял, почему.

// function bodyParserJson() {
//   bodyParser.json({ type: 'application/json' });
// }
