/* eslint-disable no-underscore-dangle */
/* ИМПОРТ */
const routerCards = require('express').Router();

const { sendWholeJson } = require('../helpers/helpers.js');

/* РУТЕРЫ */
routerCards.get('/cards', (req, res) => {
  sendWholeJson('cards.json', res);
});

/* ЭКСПОРТ */
module.exports = routerCards;
