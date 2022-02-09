const mongoose = require('mongoose');
const User = require('../models/User');

exports.validateQuery = async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) {
    throw new Error('userId 쿼리를 전달해주어야 합니다.');
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('유효하지 않은 userId 입니다');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`해당 유저를 찾을 수 없습니다 id: ${userId}`);
  }

  return next();
};

exports.validateRoom = (req, res, next) => {
  const { mode, title, speed, time } = req.body;

  if (!mode) {
    throw new Error('mode가 없습니다');
  }

  if (!['survival', 'oneOnOne', 'solo'].includes(mode)) {
    throw new Error('mode는 survival, oneOnOne, solo 중에 하나여야 합니다');
  }

  if (!(typeof title === 'string')) {
    throw new Error('title은 문자열이어야 합니다');
  }

  req.body.title = req.body.title.trim();

  if (!req.body.title) {
    throw new Error('title이 없습니다');
  }

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
