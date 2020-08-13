const User = require('../models/user');
const {
  createUserHandler,
  getAllUsersHandler,
  getSingleUserHandler,
  updateProfileHandler,
  updateAvatarHandler,
} = require('../helpers/helpers');

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  createUserHandler(User.create({ name, about, avatar }), req, res);
}

function getAllUsers(req, res) {
  getAllUsersHandler(User.find({}), req, res);
}

function getSingleUser(req, res) {
  getSingleUserHandler(User.findById(req.params.id), req, res);
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  updateProfileHandler(User.findByIdAndUpdate(
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
  updateAvatarHandler(User.findByIdAndUpdate(
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
