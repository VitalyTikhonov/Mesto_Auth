const User = require('../models/user');
const { controllerPromiseHandler, userControllerPromiseHandler, makeErrorMessagesPerField } = require('../helpers/helpers');

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const fieldErrorMap = {
        name: 'Ошибка в поле Name.',
        about: 'Ошибка в поле About.',
        avatar: 'Проблема с аватаркой.',
      };
      res.status(400).send({ message: makeErrorMessagesPerField(fieldErrorMap, err) });
    });
}

function getAllUsers(req, res) {
  controllerPromiseHandler(User.find({}), req, res);
}

function getSingleUser(req, res) {
  userControllerPromiseHandler(User.findById(req.params.id), req, res);
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  userControllerPromiseHandler(User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ), req, res);
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  userControllerPromiseHandler(User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ), req, res);
}

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
};
