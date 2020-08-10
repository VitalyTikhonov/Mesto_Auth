const urlRegex = /^https?:\/\/(?:(?:\d{1,3}(?:\.\d{1,3}){1,3}\.\d{1,3}(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)(?:(?:\/[a-z0-9]+)+(?:\/|#|(?:\.[a-z0-9])+)?)?)|(?:(?:www\.)?[a-z0-9]+(?:(?:[-.][a-z0-9]+){1,}(?=\.))\.[a-z0-9]+)(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)?(?:(?:\/[A-z0-9]+){1,}(?:\/|#|(?:\.[A-z0-9]+))?)?)$/;

function makeErrorMessagesPerField(fieldErrorMap, actualError) {
  const expectedBadFields = Object.keys(fieldErrorMap);
  const actualBadFields = Object.keys(actualError.errors);
  const messageArray = [];
  let consolidatedMessage = null;
  if (expectedBadFields.some((field) => actualBadFields.includes(field))) {
    expectedBadFields.forEach((field) => {
      if (actualBadFields.includes(field)) {
        messageArray.push(fieldErrorMap[field]);
      }
    });
    consolidatedMessage = messageArray.join(' ');
  }
  return consolidatedMessage;
}

function controllerPromiseHandler(promise, req, res) {
  promise
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` }));
}

function userControllerPromiseHandler(promise, req, res) {
  promise
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Такого пользователя нет' });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      // res.status(500).send(err);
      // console.log('typeof err', typeof err);
      if (err.kind === 'ObjectId') {
        res.status(404).send({ message: 'Такого пользователя нет' });
      } else {
        const fieldErrorMap = {
          name: 'Ошибка в поле Name.',
          about: 'Ошибка в поле About.',
        };
        res.status(400).send({ message: makeErrorMessagesPerField(fieldErrorMap, err) });
      }
    });
}

function cardControllerPromiseHandler(promise, req, res) {
  promise
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка не существует' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({ message: 'Карточка не существует' });
      } else {
        res.status(500).send({ message: `Ошибка! ${err.message}` });
      }
    });
}

module.exports = {
  urlRegex,
  controllerPromiseHandler,
  userControllerPromiseHandler,
  cardControllerPromiseHandler,
  makeErrorMessagesPerField,
};
