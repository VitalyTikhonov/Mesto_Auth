const Card = require('../models/card');
const { controllerPromiseHandler } = require('../helpers/helpers');

function getAllCards(req, res) {
  controllerPromiseHandler(Card.find({}), req, res);
  // Card.find({})
  //   .then((users) => res.send({ data: users }))
  //   .catch(() => res.status(500).send(err));
}

/*
const User = require('../models/user');
Существование пользователя не проверяется, что очень странно. В первом приближении
реализовать не удалось: User.exist не возвращал ожидаемый отриц. результат.
*/
function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const fieldErrorMap = {
        name: 'Недопустимое название места.',
        link: 'Проблема со ссылкой на изображение.',
      };
      res.status(400).send({ message: 'makeErrorMessagesPerField'(fieldErrorMap, err) });
    });
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
