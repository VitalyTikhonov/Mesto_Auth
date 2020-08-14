const Card = require('../models/card');
const {
  createDocHandler,
  getAllOrDeleteHandler,
  getUserOrLikesHandler,
  errors,
  isUserExistent,
} = require('../helpers/helpers');

function getAllCards(req, res) {
  getAllOrDeleteHandler(Card.find({}), req, res);
}

function createCard(req, res) {
  const { name, link } = req.body;
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        createDocHandler(Card.create({ name, link, user }), req, res);
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
        getAllOrDeleteHandler(Card.findByIdAndRemove(req.params.cardId), req, res);
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
        getUserOrLikesHandler(Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: user } },
          { new: true },
        ), req, res, 'card');
      } else {
        throw new Error();
      }
    })
    .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
}

function unlikeCard(req, res) {
  const user = req.user._id;
  isUserExistent(user)
    .then((checkResult) => {
      if (checkResult) {
        getUserOrLikesHandler(Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: user } },
          { new: true },
        ), req, res, 'card');
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
  unlikeCard,
};
