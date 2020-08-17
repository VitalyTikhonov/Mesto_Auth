/*
Пометки для себя на будущее и для ревьюэра
Код получился сложноват. Пытался уницифицировать его, избавиться от повторений
и поэтому вынес основную логику контроллеров в "хелпер".
Правда, когда потребовалось добавить еще одну проверку, необходимую перед методами
findbyId и т. п., пришлось разместить ее в try...catch в файлах контроллеров,
что нарушает принятую ранее логику организации кода.
Была идея, как от этого уйти, но требуется новая кардинальная переработка проекта. Надеюсь
это сделать, но пока придется отправить как есть, учитывая, что все работает, ошибок
при тестировании не обнаруживаю. (Методы Mongoose для обращения к БД должны быть в helpers,
тогда и try...catch, а значит и операции внутри них можно будет переместить туда же.)
Возможно, также стоит подумать о Promise.all?..
*/

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCards = require('./routes/routerCards.js');
const routerUsers = require('./routes/routerUsers.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    // _id: '5f305eff48dca67ac55c19c2', // нет
    _id: '5f37011e5e6f31ac63711d99',
    // _id: '5f3591131c8d4313a87367a', // невалидный
  };
  next();
});
app.use('/cards', routerCards);
app.use('/users', routerUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}.`);
});
