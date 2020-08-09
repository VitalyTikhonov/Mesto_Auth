const Card = require('../models/card');
const { controllerPromiseHandler } = require('../helpers/helpers');

function getAllCards(req, res) {
  controllerPromiseHandler(Card.find({}), req, res);
  // Card.find({})
  //   .then((users) => res.send({ data: users }))
  //   .catch(() => res.status(500).send(err));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  // controllerPromiseHandler(Card.create({ name, link, owner }), req, res);
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    // .catch((err) => res.status(400).send({ message: `Ошибка! ${err.message}` }));
    .catch((err) => res.status(400).send(err));
}

function likeCard(req, res) {
  controllerPromiseHandler(Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ), req, res);
}

function dislikeCard(req, res) {
  controllerPromiseHandler(Card.findByIdAndUpdate(
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
