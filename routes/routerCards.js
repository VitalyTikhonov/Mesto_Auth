/* ИМПОРТ */
const routerCards = require('express').Router();
const {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

/* РУТЕРЫ */
routerCards.get('/', getAllCards);

routerCards.post('/', createCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', dislikeCard);

/* ЭКСПОРТ */
module.exports = routerCards;
