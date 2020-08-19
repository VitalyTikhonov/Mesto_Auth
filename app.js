const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rCards = require('./routes/rCards.js');
const rUsers = require('./routes/rUsers.js');
const { createUser, login } = require('./controllers/ctUsers.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
// app.use((req, res, next) => {
//   req.user = {
//     // _id: '5f305eff48dca67ac55c19c2', // нет
//     _id: '5f37011e5e6f31ac63711d99',
//     // _id: '5f3591131c8d4313a87367a', // невалидный
//   };
//   next();
// });
app.use('/cards', rCards);
app.use('/users', rUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}.`);
});
