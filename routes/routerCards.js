/* ИМПОРТ */
const routerCards = require('express').Router();
const { getAllCards, createCard } = require('../controllers/cards');

/* РУТЕРЫ */
routerCards.get('/', getAllCards);

routerCards.post('/', createCard);

/* ЭКСПОРТ */
module.exports = routerCards;
