const { Game } = require('../models/Game');
const Room = require('../models/Room');
const {
  required,
  validateId,
  findExistentUserId,
  checkTypeOfNumber,
  checkTypeOfString,
  checkTypeOfBoolean,
  checkTypeOfMode,
  checkTypeOfRole,
} = require('../utils/validator');

exports.validateQuery = (req, res, next) => {
  const { userId } = req.query;

  validateId(userId);
  findExistentUserId(userId);

  return next();
};

exports.validateRoomId = async (req, res, next) => {
  const { id } = req.params;

  validateId(id);

  const roomId = await Room.findById(id);

  if (!roomId) {
    throw new Error('해당 id를 찾을 수 없습니다');
  }

  return next();
};

exports.validateRoom = (req, res, next) => {
  const { mode, title, speed, time } = req.body;

  required([mode]);

  checkTypeOfMode(mode);

  checkTypeOfString(title);

  req.body.title = req.body.title.trim();
  required([req.body.title]);

  if (speed && !(typeof speed === 'number')) {
    throw new Error('speed는 숫자여야 합니다');
  }

  if (speed && (speed < 1 || speed > 20)) {
    throw new Error('speed는 1 이상 20 이하여야 합니다');
  }

  if (time && !(typeof time === 'number')) {
    throw new Error('time은 숫자여야 합니다');
  }

  if (time && (time < 30 || time > 2000)) {
    throw new Error('time은 30 이상 2000이하여야 합니다');
  }

  next();
};

exports.validateCreateGameRecord = async (req, res, next) => {
  const {
    player: { id, isWinner, distance, time, speed, role },
    mode,
  } = req.body;

  validateId(id);
  findExistentUserId(id);

  required([distance, time, speed, role, mode]);

  checkTypeOfBoolean(isWinner);
  checkTypeOfNumber(distance);
  checkTypeOfNumber(time);
  checkTypeOfNumber(speed);
  checkTypeOfRole(role);
  checkTypeOfMode(mode);

  return next();
};

exports.validateUpdateGameRecord = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, isWinner, distance, time, speed, role } = req.body;

  validateId(id);

  const game = await Game.findById(id);

  if (!game) {
    throw new Error(`해당 게임을 찾을 수 없습니다 id: ${id}`);
  }

  validateId(userId);
  findExistentUserId(userId);

  required([distance, time, speed, role]);

  checkTypeOfBoolean(isWinner);
  checkTypeOfNumber(distance);
  checkTypeOfNumber(time);
  checkTypeOfNumber(speed);
  checkTypeOfRole(role);

  return next();
};
