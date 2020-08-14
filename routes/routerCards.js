/* ИМПОРТ */
const routerCards = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

/* РУТЕРЫ */
routerCards.get('/', getAllCards);

routerCards.post('/', createCard);

routerCards.delete('/:cardId', deleteCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', dislikeCard);

/* ЭКСПОРТ */
module.exports = routerCards;
