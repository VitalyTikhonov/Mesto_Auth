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
app.listen(PORT);
app.use((req, res, next) => {
  req.user = {
    // _id: '5f2ee70bfdc57beb06e3c573',
    _id: '5f2daed4c1763f729f2a5a96',
  };

  next();
});
app.use('/cards', routerCards);
app.use('/users', routerUsers);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
