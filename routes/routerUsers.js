/* ИМПОРТ */
const routerUsers = require('express').Router();
// const bodyParser = require('body-parser');
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
} = require('../controllers/users');

// const bodyParserJson = bodyParser.json({ type: 'application/json' });

/* РУТЕРЫ */
routerUsers.get('/', getAllUsers);

routerUsers.get('/:id', getSingleUser);

routerUsers.patch('/me', updateProfile);

// routerUsers.post('/', bodyParser.json({ type: 'application/json' }), createUser);
// routerUsers.post('/', bodyParserJson, createUser);
routerUsers.post('/', createUser);

/* ЭКСПОРТ */
module.exports = routerUsers;
