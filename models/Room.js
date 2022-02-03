const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  mode: {
    type: String,
    enum: ['OneOnOne', 'Survival'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  speed: Number,
  time: Number,
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Room', roomSchema);
