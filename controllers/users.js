const User = require('../models/user');
const { controllerPromiseHandler } = require('../helpers/helpers');

function createUser(req, res) {
  const config = {
    arguments: {},
    then: {
      check: 'configMap.check.no',
      ifTrue: 'configMap.send.DBObject',
    },
    catch: {
      check: 'configMap.check.no',
      ifTrue: 'configMap.send.error.invalidData',
    },
  };
  const { name, about, avatar } = req.body;
  controllerPromiseHandler(User.create({ name, about, avatar }), req, res, config);
}

function getAllUsers(req, res) {
  controllerPromiseHandler(User.find({}), req, res);
}

function getSingleUser(req, res) {
  controllerPromiseHandler(User.findById(req.params.id), req, res);
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  controllerPromiseHandler(User.findByIdAndUpdate(
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
  controllerPromiseHandler(User.findByIdAndUpdate(
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
