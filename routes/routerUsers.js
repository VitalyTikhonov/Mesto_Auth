/* ИМПОРТ */
const routerUsers = require('express').Router();
// const bodyParser = require('body-parser');
const { createUser, getAllUsers, getSingleUser } = require('../controllers/users');

// const bodyParserJson = bodyParser.json({ type: 'application/json' });

/* РУТЕРЫ */
routerUsers.get('/users', getAllUsers);

routerUsers.get('/users/:id', getSingleUser);

// routerUsers.post('/users', bodyParser.json({ type: 'application/json' }), createUser);
// routerUsers.post('/users', bodyParserJson, createUser);
routerUsers.post('/users', createUser);

/* ЭКСПОРТ */
module.exports = routerUsers;
