const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    match: /^https?:\/\/(?:(?:\d{1,3}(?:\.\d{1,3}){1,3}\.\d{1,3}(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)(?:(?:\/[a-z0-9]+)+\/?#?)?)|(?:(?:www\.)?[a-z0-9]+(?:-[a-z0-9]+)*\.(?:[a-z0-9]+))(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)?(?:(?:\/[a-z0-9]+)+\/?#?)?)$/,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
