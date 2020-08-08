const Card = require('../models/card');
const { controllerPromiseHandler } = require('../helpers/helpers');

function getAllCards(req, res) {
  controllerPromiseHandler(Card.find({}), req, res);
  // Card.find({})
  //   .then((users) => res.send({ data: users }))
  //   .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  controllerPromiseHandler(Card.create({ name, link, owner }), req, res);
  // User.create({ name, link })
  // .then((user) => res.send({ data: user }))
  // .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getAllCards,
  createCard,
};
