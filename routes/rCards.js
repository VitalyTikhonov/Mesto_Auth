/* ИМПОРТ */
const routerCards = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/ctCards');

/* РУТЕРЫ */
routerCards.get('/', getAllCards);

routerCards.post('/', createCard);

routerCards.delete('/:cardId', deleteCard);

routerCards.put('/:cardId/likes', likeCard);

routerCards.delete('/:cardId/likes', unlikeCard);

/* ЭКСПОРТ */
module.exports = routerCards;
