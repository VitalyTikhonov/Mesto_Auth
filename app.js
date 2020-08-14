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
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}.`);
});
app.use((req, res, next) => {
  req.user = {
    // _id: '5f305eff48dca67ac55c19c1', // нет
    _id: '5f3591131c8d4313a87367ea',
    // _id: '5f3591131c8d4313a87367a', // невалидный
  };
  next();
});
app.use('/cards', routerCards);
app.use('/users', routerUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
