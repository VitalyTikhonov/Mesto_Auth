const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routerCards = require('./routes/routerCards.js');
const routerUsers = require('./routes/routerUsers.js');

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;
const app = express();
app.listen(PORT);
app.use(express.static(path.join(__dirname, 'public')));
app.use(routerCards);
app.use(routerUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
