const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  createDocHandler,
  loginHandler,
  getAllDocsHandler,
  getLikeDeleteHandler,
  updateHandler,
  errors,
  isObjectIdValid,
} = require('../helpers/helpers');

function createUser(req, res) {
  const {
    name,
    about,
    avatar,
    password,
    email,
  } = req.body;

  /* По аналогии с тем, как в тренажере предложено сделать для авторизации
  (User.findByCredentials), пытался сделать и здесь, чтобы проверять, не занята ли почта,
  прежде чем считать хеш пароля. Но не получилось разобраться с множеством ошибок, которые
  возникали. */
  bcrypt.hash(password, 10)
    .then((hash) => {
      createDocHandler(User.create({
        name,
        about,
        avatar,
        password: hash,
        email,
      }), req, res);
    });
}

function login(req, res) {
  const { email, password } = req.body;
  return loginHandler(User.findByCredentials(email, password), req, res); // Зачем тут return?
}

function getAllUsers(req, res) {
  getAllDocsHandler(User.find({}), req, res);
}

function getSingleUser(req, res) {
  try {
    const userId = req.params.id;
    isObjectIdValid(userId, 'user');
    getLikeDeleteHandler(User.findById(userId), req, res, 'user');
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { name, about } = req.body;
    updateHandler(User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    ), req, res);
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { avatar } = req.body;
    updateHandler(User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    ), req, res);
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

module.exports = {
  createUser,
  login,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
};
