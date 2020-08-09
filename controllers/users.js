const User = require('../models/user');
const { controllerPromiseHandler } = require('../helpers/helpers');

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  // controllerPromiseHandler(User.create({ name, about, avatar }), req, res);
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: `Ошибка! ${err.message}` }));
}

function getAllUsers(req, res) {
  controllerPromiseHandler(User.find({}), req, res);
  // User.find({})
  // .then((users) => res.send({ data: users }))
  // .catch(() => res.status(500).send(err));
}

function getSingleUser(req, res) {
  controllerPromiseHandler(User.findById(req.params.id), req, res);
  // User.findById(req.params.id)
  // .then((user) => res.send({ data: user }))
  // .catch(() => res.status(500).send(err));
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  controllerPromiseHandler(User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ), req, res);
  // User.findById(req.params.id)
  // .then((user) => res.send({ data: user }))
  // .catch(() => res.status(500).send(err));
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  controllerPromiseHandler(User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ), req, res);
  // User.findById(req.params.id)
  // .then((user) => res.send({ data: user }))
  // .catch(() => res.status(500).send(err));
}

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
};
