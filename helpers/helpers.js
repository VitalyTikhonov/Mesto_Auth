const errors = {
  byField: {
    name: 'Ошибка в поле Name.',
    about: 'Ошибка в поле About.',
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

const configMap = {
  check: {
    no: (checkable) => checkable, // нужно просто true
    // configMap.check.no(checkable)
    orFail: ({ res, doc }) => {
      res.status(404).send({ message: `${errors.byDocType[doc]}` });
    },
    // .orFail(configMap.check.orFail(res, doc))
    errObj: (errorType) => errorType === 'ObjectId', // check.errorObj(err.kind)
    // configMap.check.errObj(errorType)
  },
  send: {
    DBObject: ({ res, respObj }) => { res.send({ data: respObj }); },
    // configMap.send.DBObject(res, respObj)
    error: {
      noDoc: ({ res, doc }) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      // configMap.send.error.noDoc(res, doc)
      server: ({ res, err }) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      // configMap.send.error.server(res, err)
      invalidData: ({ res, err }) => {
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      },
      // configMap.send.error.invalidData(res, err)
    },
  },
};
function createUserHandler(promise, req, res) {
  promise
    .then()
    .catch((err) => {
    });
}

module.exports = {
  createUserHandler,
};
