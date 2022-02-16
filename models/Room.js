const mongoose = require('mongoose');

const { useVirtualId } = require('../database/database');

const participantsSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  isReady: {
    type: Boolean,
    required: true,
    default: false,
  },
});

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
  participants: [participantsSchema],
});

useVirtualId(roomSchema);

module.exports = mongoose.model('Room', roomSchema);
