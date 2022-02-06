const mongoose = require('mongoose');
const User = require('../models/User');

exports.validateQuery = async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send('userId 쿼리를 전달해주어야 합니다.');
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).send('유효하지 않은 userId 입니다');
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send(`해당 유저를 찾을 수 없습니다 id: ${userId}`);
  }

  return next();
};
