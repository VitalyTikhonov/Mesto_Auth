const Card = require('../models/card');
const {
  errors,
  getAllCardsHandler,
  createCardHandler,
  deleteCardHandler,
  likeCardHandler,
  unLikeCardHandler,
  isUserExistent,
} = require('../helpers/helpers');

function getAllCards(req, res) {
  getAllCardsHandler(Card.find({}), req, res);
}

function createCard(req, res) {
  const { name, link } = req.body;
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        createCardHandler(Card.create({ name, link, user }), req, res);
      } else {
        throw new Error();
      }
    })
    .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
}

function deleteCard(req, res) {
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        deleteCardHandler(Card.findByIdAndRemove(req.params.cardId), req, res);
      } else {
        throw new Error();
      }
    })
    .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
}

function likeCard(req, res) {
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        likeCardHandler(Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: user } },
          { new: true },
        ), req, res);
      } else {
        throw new Error();
      }
    })
    .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
}

function dislikeCard(req, res) {
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        unLikeCardHandler(Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: user } },
          { new: true },
        ), req, res);
      } else {
        throw new Error();
      }
    })
    .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
