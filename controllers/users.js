const User = require('../models/user');
const {
  createDocHandler,
  getAllOrDeleteHandler,
  getUserOrLikesHandler,
  updateHandler,
} = require('../helpers/helpers');

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  createDocHandler(User.create({ name, about, avatar }), req, res);
}

function getAllUsers(req, res) {
  getAllOrDeleteHandler(User.find({}), req, res);
}

function getSingleUser(req, res) {
  getUserOrLikesHandler(User.findById(req.params.id), req, res, 'user');
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  updateHandler(User.findByIdAndUpdate(
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
  updateHandler(User.findByIdAndUpdate(
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
