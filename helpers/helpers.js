/*
Предпринята попытка реализовать сложный объект-карту (configMap), который бы служил
единым интерфейсом, позволяющим передавать любую комбинацию параметров в контроллеры,
точнее в единую функцию (controllerPromiseHandler), обрабатывающую промисы контроллеров.
К сожалению, на данный момент не работает.
В Run.js работало при таком же синтаксисе передачи аругментов через деструктуризацию,
но без методов send в объекте configMap. Ошибка возникает не на этапе загрузки файла,
а в том случае, если происходит обращение к методам configMap из нижестоящей функции.
Из чего я делаю вывод, что проблема не в неопределяемости метода send в configMap,
а в потере контекста?

Текущая реализация предполагает, что на основе объекта-карты вручную создается объект-конфиг
для конкретного контроллера. Он наряду с функцией – обработчиком промиса
экспортируется, передается в методы контроллера, а оттуда – (как это ни странно)
своему "корешу" – обработчику промиса.
Пришлось попробовать такой вариант вынужденно:
изначально предполагалось создавать конфиг непосредственно в контроллере. Но так
указываемые там отсылки к методам configMap не определялись (в файле контроллера возникала
ошибка configMap is not defined и функция, вызванная по ним из файла helpers,
не определялась => превратил их (отсылки, значения свойств конфига) в строки и пытался
превращать их уже в helpers в функции – ломалась сложная система передачи параметров =>
поэтому попытался перенести создание конфига в helpers).
Возможен и другой вариант. Объект-конфиг создавать здесь же,
передавать его в создаваемый здесь же вариант функции – обработчика промисов
controllerPromiseHandler. Таким образом, предусматривается по варианту объекта-конфига
(как и ранее) и варианту controllerPromiseHandler для каждого контроллера.

В данный момент целесообразность дальнейшей разработки в этом направлении сомнительна.
*/

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
        // console.log('res', res);
        // console.log('err', err);
        // console.log('typeof err', typeof err);
        res.status(400).send({ message: joinErrorMessages(errors.byField, err) });
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
    .then((responseObject) => {
      if (options.then.check(responseObject)) {
        options.then.ifTrue(options.arguments);
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
