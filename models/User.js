const mongoose = require('mongoose');

const { useVirtualId } = require('../database/database');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  gameHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
  refreshToken: {
    type: String,
    unique: true,
  },
});

useVirtualId(userSchema);

module.exports = mongoose.model('User', userSchema);
