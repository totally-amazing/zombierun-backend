const { getGamesByUserId } = require('../models/Game');
const { convertFirstLetterCase } = require('../utils');

exports.getTotalRecord = async (req, res) => {
  const { userId } = req.query;
  const initialRecord = {
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
  };
  const allGames = await getGamesByUserId(userId);

  if (!allGames.length) {
    return res.send(initialRecord);
  }

  const mappedGames = allGames.map(({ players, mode }) => {
    const playerInfo = players.find((player) => String(player.id) === userId);

    return { ...playerInfo, mode };
  });

  const totalRecord = mappedGames.reduce((acc, game) => {
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
  }, initialRecord);

  return res.send(totalRecord);
};
