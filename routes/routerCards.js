/* ИМПОРТ */
const routerCards = require('express').Router();
const { getAllCards, createCard } = require('../controllers/cards');

/* РУТЕРЫ */
routerCards.get('/cards', getAllCards);

routerCards.post('/cards', createCard);

/* ЭКСПОРТ */
module.exports = routerCards;
