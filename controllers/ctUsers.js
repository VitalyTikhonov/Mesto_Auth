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
    email,
    password,
  } = req.body;

  /* В тренажере такое было перед авторизацией. Но, аналогично, зачем считать хеш,
  если почта не катит? */
  User.findByEmail({ email }, req, res)
    .then(
      bcrypt.hash(password, 10)
        .then((hash) => {
          createDocHandler(User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }), req, res);
          /* Какая еще trailing comma?? */
          // eslint-disable-next-line comma-dangle
        })
    );
}

function login(req, res) {
  const { email, password } = req.body;
  return loginHandler(User.findByCredentials(email, password), req, res);
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
