/* eslint-disable no-underscore-dangle */
/* ИМПОРТ */
const routerUsers = require('express').Router();

const { readFileAsset, searchForUser, sendWholeJson } = require('../helpers/helpers.js');

/* РУТЕРЫ */
routerUsers.get('/users', (req, res) => {
  sendWholeJson('users.json', res);
});

routerUsers.get('/users/:id', (req, res) => {
  const usersReadStream = readFileAsset('users.json', res);
  let users = '';

  usersReadStream.on('data', (data) => {
    users += data;
  });

  usersReadStream.on('end', () => {
    users = JSON.parse(users);

    if (!searchForUser(users, [req.params.id])) {
      res.status(404).send({ message: 'Нет пользователя с таким id' });
      return;
    }

    res.send(searchForUser(users, [req.params.id]));
  });
});

/* ЭКСПОРТ */
module.exports = routerUsers;
