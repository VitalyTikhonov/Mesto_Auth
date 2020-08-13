const Card = require('../models/card');
const { getAllCardsHandler, createCardHandler, likeCardHandler, unLikeCardHandler, isUserExistent } = require('../helpers/helpers');

function getAllCards(req, res) {
  getAllCardsHandler(Card.find({}), req, res);
}

/*
const User = require('../models/user');
Существование пользователя не проверяется, что очень странно. В первом приближении
реализовать не удалось: User.exist не возвращал ожидаемый отриц. результат.
*/
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  createCardHandler(Card.create({ name, link, owner }), req, res);
  // User.exists({ _id: owner })
  //   .then(() => createCardHandler(Card.create({ name, link, owner }), req, res))
  //   .catch(() => );
}

/* Существование пользователя не проверяется */
function likeCard(req, res) {
  likeCardHandler(Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ), req, res);
}

/* Существование пользователя не проверяется */
function dislikeCard(req, res) {
  unLikeCardHandler(Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ), req, res);
}

module.exports = {
  getAllCards,
  createCard,
  likeCard,
  dislikeCard,
};
