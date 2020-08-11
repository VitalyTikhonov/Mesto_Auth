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
    error: {
      noDoc: ({ res, doc }) => {
        res.status(404).send({ message: `${errors.byDocType[doc]}` });
      },
      server: ({ res, err }) => {
        res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
      },
      invalidData: ({ res, err }) => {
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
      },
    },
  },
};
/*
configMap.check.no(checkable)
configMap.check.respObj(respObj)
configMap.check.errObj(errorType)
configMap.send.DBObject(res, respObj)
configMap.send.error.noDoc(res, doc)
configMap.send.error.server(res, err)
configMap.send.error.invalidData(res, err)
 */
function createUserHandler(promise, req, res) {
  promise
    .then((respObj) => {
      if ( (respObj)) {
        then.ifTrue({ res, respObj, ...arguments });
      } else {
        then.ifFalse(arguments);
      }
    })
    .catch((err) => {
      if (catch.check(err)) {
        catch.ifTrue({ res, err, ...arguments });
      } else {
        catch.ifFalse({ res, err, ...arguments });
      }
    });
}

module.exports = {
  createUserHandler,
};
