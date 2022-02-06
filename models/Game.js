const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
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
      type: [playerSchema],
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

const Game = mongoose.model('Game', gameSchema);

exports.getGamesByUserId = async (userId) => {
  const games = await Game.find()
    .where('players')
    .elemMatch({ id: userId })
    .lean();

  return games;
};

module.exports = Game;
