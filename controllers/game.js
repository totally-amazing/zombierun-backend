const Game = require('../models/Game');
const { convertFirstLetterCase } = require('../utils');

exports.getTotalRecord = async (req, res, next) => {
  const { userId } = req.query;
  const allGames = await Game.find().lean();
  const gamesOfUser = allGames.map(({ players, mode }) => {
    const playerInfo = players.find((player) => String(player.id) === userId);

    return { ...playerInfo, mode };
  });

  const totalRecord = gamesOfUser.reduce(
    (acc, game) => {
      const total = { ...acc };
      total.distance += game.distance;
      total.time += game.time;
      const mode = convertFirstLetterCase(game.mode);

      if (game.isWinner) {
        total[mode].isWinner += 1;
      } else if (total[mode].isLoser !== undefined) {
        total[mode].isLoser += 1;
      }

      return total;
    },
    {
      distance: 0,
      time: 0,
      solo: {
        isWinner: 0,
        isLoser: 0,
      },
      oneOnOne: {
        isWinner: 0,
        isLoser: 0,
      },
      survival: {
        isWinner: 0,
      },
    }
  );

  res.send(totalRecord);
};
