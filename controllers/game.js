const { Game, getGamesByUserId } = require('../models/Game');
const User = require('../models/User');

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

    if (game.isWinner) {
      total[game.mode].isWinner += 1;
    } else if (total[game.mode].isLoser !== undefined) {
      total[game.mode].isLoser += 1;
    }

    return total;
  }, initialRecord);

  return res.send(totalRecord);
};

exports.getRecentRecord = async (req, res) => {
  const { userId } = req.query;
  const initialRecord = {
    distance: 0,
    time: 0,
    speed: 0,
    isWinner: false,
    mode: 'solo',
  };

  const user = await User.findById(userId);

  if (!user.gameHistory.length) {
    return res.send(initialRecord);
  }

  const lastGameId = user.gameHistory[user.gameHistory - 1];
  const lastGame = await Game.findById(lastGameId);
  const recentRecord = lastGame.players.find(
    (player) => player.id.toString() === userId
  );

  return res.send({
    isWinner: recentRecord.isWinner,
    distance: recentRecord.distance,
    speed: recentRecord.speed,
    time: recentRecord.time,
    role: recentRecord.role,
    mode: lastGame.mode,
  });
};

exports.createGameRecord = async (req, res) => {
  const {
    player: { id, isWinner, distance, time, speed, role },
    mode,
  } = req.body;

  const result = await Game.create({
    mode,
    players: {
      id,
      isWinner,
      distance,
      time,
      speed,
      role,
    },
  });

  await User.findByIdAndUpdate(id, { $push: { gameHistory: result._id } });

  res.status(201).send(result._id);
};

exports.updateGameRecord = async (req, res) => {
  const { id } = req.params;
  const { id: userId, isWinner, distance, time, speed, role } = req.body;

  await Game.findByIdAndUpdate(id, {
    $push: { players: { id: userId, isWinner, distance, time, speed, role } },
  });

  await User.findByIdAndUpdate(userId, { $push: { gameHistory: id } });

  res.status(201).end();
};
