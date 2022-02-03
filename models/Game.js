const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  isWinner: {
    type: Boolean,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Human', 'Zombie'],
    default: 'Human',
  },
});

const gameSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      required: true,
      enum: ['Solo', 'OneOnOne', 'Surviavl'],
    },
    players: {
      type: Map,
      of: playerSchema,
    },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Game', gameSchema);
