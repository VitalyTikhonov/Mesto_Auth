const User = require('../models/user');
const { readFileAsset, searchForUser, sendWholeJson } = require('../helpers/helpers.js');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getAllUsers(req, res) {
  sendWholeJson('users.json', res);
}

function getSingleUser(req, res) {
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
}

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
};
