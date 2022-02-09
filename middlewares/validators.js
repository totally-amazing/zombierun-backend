const { Game } = require('../models/Game');
const {
  required,
  validateId,
  findExistentUserId,
  checkTypeofNumber,
  checkTypeofString,
  checkTypeofBoolean,
} = require('../utils/validator');

exports.validateQuery = (req, res, next) => {
  const { userId } = req.query;

  validateId(userId);
  findExistentUserId(userId);

  return next();
};

exports.validateRoom = (req, res, next) => {
  const { mode, title, speed, time } = req.body;

  required(mode);

  if (!['survival', 'oneOnOne', 'solo'].includes(mode)) {
    throw new Error('mode는 survival, oneOnOne, solo 중에 하나여야 합니다');
  }

  checkTypeofString(title);

  req.body.title = req.body.title.trim();
  required(req.body.title);

  if (speed && !(typeof speed === 'number')) {
    throw new Error('speed는 숫자여야 합니다');
  }

  if (speed && (speed < 1 || speed > 20)) {
    throw new Error('speed는 1 이상 20 이하여야 합니다');
  }

  if (time && !(typeof time === 'number')) {
    throw new Error('time은 숫자여야 합니다');
  }

  if (time && !(time < 30 || time > 2000)) {
    throw new Error('time은 30 이상 2000이하여야 합니다');
  }

  next();
};

exports.validateGameHistory = async (req, res, next) => {
  const { player, gameId } = req.body;
  const { id, isWinner, distance, time, speed, role } = player;

  validateId(gameId);

  const game = await Game.findById(gameId);

  if (!game) {
    throw new Error(`해당 게임을 찾을 수 없습니다 id: ${gameId}`);
  }

  validateId(id);
  findExistentUserId(id);

  required(isWinner);
  required(distance);
  required(time);
  required(speed);
  required(role);

  checkTypeofBoolean(isWinner);
  checkTypeofNumber(distance);
  checkTypeofNumber(time);
  checkTypeofNumber(speed);

  if (!['human', 'zombie'].includes(role)) {
    throw new Error('role은 human, zombie 중에 하나여야 합니다');
  }

  return next();
};
