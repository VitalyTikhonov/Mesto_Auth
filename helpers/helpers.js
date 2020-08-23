const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const tempKey = '09a0fdc421445fae5719b27f4d280f760e9a457dffd627e617d4992e6e4aa05f';
const errors = {
  byField: {
    name: 'Ошибка в поле Name.',
    email: 'Ошибка в поле Email.',
    about: 'Ошибка в поле About.',
    avatar: 'Проблема с аватаркой.',
    link: 'Проблема с изображением.',
  },
  byDocType: {
    user: 'Такого пользователя нет',
    card: 'У пользователя нет такой карточки',
  },
  objectId: {
    user: 'Ошибка в идентификаторе пользователя',
    card: 'Ошибка в идентификаторе карточки',
  },
};

const passwordRegexp = /[\u0023-\u0126]+/;

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

function isUserExistent(id) {
  return User.exists({ _id: id });
}

function isObjectIdValid(id, docType) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error();
    error.docType = docType;
    throw error;
  }
}

function createDocHandler(promise, req, res, docType) {
  promise
    .then((respObj) => {
      if (docType === 'user') {
        const {
          name,
          about,
          avatar,
          email,
        } = respObj;
        res.send({
          name,
          about,
          avatar,
          email,
        });
      } else {
        res.send(respObj);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      } else if (err.code === 11000) {
        res.status(400).send({ message: 'Этот адрес электронной почты уже используется' });
      } else {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
}

function loginHandler(promise, req, res) {
  promise // findUserByCredentials
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : tempKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();

      /* Как токен попадает в req.cookies.jwt при запросе логина, то есть еще до авторизации?.. */
      // console.log('req.cookies.jwt', req.cookies.jwt);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
}

function getAllDocsHandler(promise, req, res) {
  promise
    .then((respObj) => res.send(respObj))
    .catch((err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
}

function getLikeDeleteHandler(promise, req, res, docType) {
  promise
    // .orFail() не работал, похоже на баг:
    // https://github.com/Automattic/mongoose/issues/7280
    .then((respObj) => {
      if (respObj === null) {
        res.status(404).send({ message: `${errors.byDocType[docType]}` });
      } else {
        res.send(respObj);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `${errors.byDocType[docType]}` });
      } else {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
}

function updateHandler(promise, req, res) {
  promise
    .orFail()
    .then((respObj) => res.send(respObj))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `${errors.byDocType.user}` });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      } else {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      }
    });
}

module.exports = {
  createDocHandler,
  loginHandler,
  getAllDocsHandler,
  getLikeDeleteHandler,
  updateHandler,
  errors,
  isUserExistent,
  isObjectIdValid,
  passwordRegexp,
};
