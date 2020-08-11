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
    respObj: (respObj) => respObj === null, // check.responseObj(respObj),
    errObj: (errorType) => errorType === 'ObjectId', // check.errorObj(err.kind)
  },
  send: {
    DBObject: ({ res, respObj }) => { res.send({ data: respObj }); },
    // DBObject: ({ res, respObj }) => {
    // res.send({ data: respObj });
    // console.log('res', res);
    // },
    error: {
      noDoc: ({ res, doc }) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      server: ({ res, err }) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      invalidData: ({ res, err }) => {
        // console.log('err', err);
        // console.log('typeof err', typeof err);
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      },
    },
  },
};

// function configMapSendDBObject() { }

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

const createUserConfig = {
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

function controllerPromiseHandler(promise, req, res, options) {
  promise
    .then((respObj) => {
      if (options.then.check(respObj)) {
        options.then.ifTrue({ res, respObj, ...options.arguments });
      } else {
        options.then.ifFalse(options.arguments);
      }
    })
    .catch((err) => {
      // console.log('err', err);
      if (options.catch.check(err)) {
        // console.log('{ res, err, ...options.arguments }', { res, err, ...options.arguments });
        options.catch.ifTrue({ res, err, ...options.arguments });
      } else {
        options.catch.ifFalse({ res, err, ...options.arguments });
      }
    });
}

module.exports = {
  controllerPromiseHandler,
  createUserConfig,
};
