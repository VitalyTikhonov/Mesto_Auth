/* eslint-disable no-new-func */
/* eslint-disable no-new */
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

const configMap = {
  check: {
    no: (checkable) => checkable, // нужно просто true
    respObj: (respObj) => respObj === null, // check.responseObj(respObj),
    errObj: (errorType) => errorType === 'ObjectId', // check.errorObj(err.kind)
  },
  send: {
    DBObject: ({ res, respObj }) => { res.send({ data: respObj }); },
    error: {
      noDoc: ({ res, doc }) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      server: ({ res, err }) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      invalidData: ({ res, err }) => {
        res.status(400).send({ message: makeErrorMessagesPerField(errors.byField, err) });
      },
    },
  },
};

/*
const config = {
  arguments: {},
  then: {
    check: configMap.check.no,
    ifTrue: configMap.send.DBObject,
  },
  catch: {
    check: configMap.check.no,
    ifTrue: configMap.send.error.invalidData,
  },
};
*/
/*
const config = {
  arguments: {},
  then: {
    check: configMap.,
    ifTrue: configMap.,
    ifFalse: configMap.,
  },
  catch: {
    check: configMap.,
    ifTrue: configMap.,
    ifFalse: configMap.,
  },
};
 */

function controllerPromiseHandler(promise, req, res, options) {
  promise
    .then((responseObject) => {
      if (new Function(responseObject, options.then.check)) {
        new Function(options.arguments, options.then.ifTrue);
      } else {
        new Function(options.arguments, options.then.ifFalse);
      }
    })
    .catch((err) => {
      if (new Function('err', options.catch.check)) {
        new Function('options.catch.ifTrue({ res, err, ...options.arguments })');
      } else {
        new Function({ res, err, ...options.arguments }, options.catch.ifFalse);
      }
    });
}

module.exports = {
  controllerPromiseHandler,
};
