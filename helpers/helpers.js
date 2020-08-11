const config = {
  check: {
    respObj: (respObj) => respObj === null, // check.responseObj(respObj),
    errObj: (errorType) => errorType === 'ObjectId', // check.errorObj(err.kind)
  },
  send: {
    DBObject: (res, respObj) => { res.send({ data: respObj }) },
    error: {
      noDoc: (res, doc) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      server: (res, err) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      invalidData: (res, err) => {
        res.status(400).send({ message: makeErrorMessagesPerField(errors.byField, err) });
      },
      // invalidData: {
      //   errors: {
      //     byField: { name, about },
      //     byDocType: { user, card },
      //   }
      // },
    },
  }
}

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
const send = {
  error: {
    noDoc: (res, doc) => {
      res.status(404).send({ message: `${errors.byDocType[doc]}` });
    },
    server: (res, err) => {
      res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    },
    invalidData: (res, err) => {
      res.status(400).send({ message: makeErrorMessagesPerField(errors.byField, err) });
    },
  },
  DBObject: (res, respObj) => {
    res.send({ data: respObj });
  }
};

const check = {
  responseObj: (respObj) => respObj === null, // check.responseObj(respObj)
  errorObj: (errorType) => errorType === 'ObjectId', // check.errorObj(err.kind)
};

function controllerPromiseHandler(promise, res, docType) {
  promise
    .then((respObj) => {
      if (check.responseObj(respObj)) {
        send.error.noDoc(res, docType);
      } else {
        sendDBObject(res, respObj);
      }
    })
    .catch(

    );
}




    .catch ((err) => send.error.server(res, err));

    .catch ((err) => {
  if (check.errorObj(err.kind)) {
    send.error.noDoc(res, docType);
  } else {
    send.error.invalidData(res, err);
  }
});

    .catch ((err) => {
  if (check.errorObj(err.kind)) {
    send.error.noDoc(res, docType);
  } else {
    send.error.server(res, err);
  }
});

module.exports = {
  controllerPromiseHandler,
};
