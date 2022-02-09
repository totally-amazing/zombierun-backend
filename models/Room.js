const mongoose = require('mongoose');

const { useVirtualId } = require('../database/database');

const roomSchema = mongoose.Schema({
  mode: {
    type: String,
    enum: ['oneOnOne', 'survival'],
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

useVirtualId(roomSchema);

module.exports = mongoose.model('Room', roomSchema);
