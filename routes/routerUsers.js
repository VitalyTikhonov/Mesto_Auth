/* ИМПОРТ */
const routerUsers = require('express').Router();
const { createUser, getAllUsers, getSingleUser } = require('../controllers/users');
const { bodyParserJson } = require('../helpers/helpers');

/* РУТЕРЫ */
routerUsers.get('/users', getAllUsers);

routerUsers.get('/users/:id', getSingleUser);

routerUsers.post('/users', bodyParserJson, createUser);

/* ЭКСПОРТ */
module.exports = routerUsers;
