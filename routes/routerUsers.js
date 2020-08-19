/* ИМПОРТ */
const routerUsers = require('express').Router();

const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

/* РУТЕРЫ */
routerUsers.get('/', getAllUsers);

routerUsers.get('/:id', getSingleUser);

routerUsers.patch('/me', updateProfile);

routerUsers.patch('/me/avatar', updateAvatar);

routerUsers.post('/', createUser);

/* ЭКСПОРТ */
module.exports = routerUsers;
