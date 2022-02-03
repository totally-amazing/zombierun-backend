const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('User', userSchema);
