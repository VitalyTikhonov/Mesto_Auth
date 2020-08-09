const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    match: /^https?:\/\/(?:(?:\d{1,3}(?:\.\d{1,3}){1,3}\.\d{1,3}(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)(?:(?:\/[a-z0-9]+)+\/?#?)?)|(?:(?:www\.)?[a-z0-9]+(?:-[a-z0-9]+)*\.(?:[a-z0-9]+))(?::(?:[1-9][0-9]{1,3}|(?:[1-6][0-9]{4}))(\/$)?)?(?:(?:\/[a-z0-9]+)+\/?#?)?)$/,
  },
});

module.exports = mongoose.model('user', userSchema);
