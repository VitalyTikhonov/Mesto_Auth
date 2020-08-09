const mongoose = require('mongoose');

const { urlRegex } = require('../helpers/helpers');

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
    match: urlRegex,
  },
});

module.exports = mongoose.model('user', userSchema);
