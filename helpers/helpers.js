const mongoose = require('mongoose');

const errors = {
  byField: {
    name: 'Ошибка в поле Name.',
    about: 'Ошибка в поле About.',
    avatar: 'Проблема с аватаркой.',
  },
  byDocType: {
    user: 'Такого пользователя нет',
    card: 'Карточка не существует',
  },
};

function joinErrorMessages(fieldErrorMap, actualError) {
  const expectedBadFields = Object.keys(fieldErrorMap);
  const actualBadFields = Object.keys(actualError.errors);
  const messageArray = [];
  let jointErrorMessage = null;
  if (expectedBadFields.some((field) => actualBadFields.includes(field))) {
    expectedBadFields.forEach((field) => {
      if (actualBadFields.includes(field)) {
        messageArray.push(fieldErrorMap[field]);
      }
    });
    jointErrorMessage = messageArray.join(' ');
  }
  return jointErrorMessage;
}

/*
const configMap = {
  check: {
    no: (checkable) => checkable, // нужно просто true
    // configMap.check.no(checkable)
    .orFail((doc) => {
      res.status(404).send({ message: `${errors.byDocType[doc]}` });
    })
    errObj: (errorType) => errorType === 'ObjectId', // err.kind === 'ObjectId'
    // configMap.check.errObj(errorType)
  },
  send: {
    DBObject: (respObj) => { res.send({ data: respObj }); },
    // configMap.send.DBObject(respObj)
    error: {
      noDoc: (doc) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      // configMap.send.error.noDoc(doc)
      server: (err) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      // configMap.send.error.server(err)
      invalidData: (err) => {
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      },
      // configMap.send.error.invalidData(err)
    },
  },
};

res.status(400).send(err); // dev
*/

function createUserHandler(promise, req, res) {
  promise
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => {
      res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
    });
}

function getAllUsersHandler(promise, req, res) {
  promise
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
}

function getSingleUserHandler(promise, req, res) {
  promise
    .orFail(() => {
      res.status(404).send({ message: `${errors.byDocType.user}` });
    })
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
}

function updateProfileHandler(promise, req, res) {
  promise
    // .orFail(() => res.status(404).send({ message: `${errors.byDocType.user}` }))
    // .orFail(() => { throw new Error(errors.byDocType.user); })
    .orFail(
      // (data) => {
      // console.log('data', data);
      // const error = new Error();
      // error.statusCode = 404;
      // error.message = `${errors.byDocType.user}`;
      // throw error;
    // }
    )
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => {
      console.log('catch - err', err instanceof mongoose.itgError.DocumentNotFoundError);
      // console.log('DocumentNotFoundError', err.DocumentNotFoundError);
      // res.status(err.statusCode).send(err.message); // dev
      // res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
}

function updateAvatarHandler(promise, req, res) {
  promise
    .orFail(() => {
      res.status(404).send({ message: `${errors.byDocType.user}` });
    })
    .then((respObj) => res.send({ data: respObj }))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
}

module.exports = {
  createUserHandler,
  getAllUsersHandler,
  getSingleUserHandler,
  updateProfileHandler,
  updateAvatarHandler,
};
