const jwt = require('jsonwebtoken');
const ERROR = require('../constants').ERROR;
const User = require('../models/User');

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  let user;
  let accessToken;
  let decodedAccessToken;
  let refreshToken;
  let decodedRefreshToken;

  try {
    accessToken = req.headers.authorization.split(' ')[1];

    decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    const { id, nickname, imageUrl } = decodedAccessToken;

    user = await User.findById(id);

    refreshToken = user.refreshToken;

    try {
      decodedRefreshToken = jwt.verify(user.refreshToken, process.env.JWT_SECRET_KEY);

    } catch (error) {
      if (error.name = TOKEN_EXPIRED_ERROR) {
        const newRefreshToken = jwt.sign({
          id,
          nickname,
          imageUrl,
        }, process.env.JWT_ACCESS_TOKEN_EXPIRES_IN, {
          expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN)
        });

        user.refreshToken = newRefreshToken;
        await user.save();
        req.user = { id, nickname, imageUrl };
        next();
      }
    }

    req.user = { id, nickname, imageUrl };
    next();
  } catch (error) {

    if (error.name = TOKEN_EXPIRED_ERROR) {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: true });

      const { id, nickname, imageUrl } = decodedAccessToken;

      try {
        decodedRefreshToken = jwt.verify(user.refreshToken, process.env.JWT_SECRET_KEY);

      } catch (error) {
        const err = new Error(ERROR.AUTHENTICATION_FAILED);

        err.status = 401;
        return next(err);
      }

      const newAccessToken = jwt.sign({
        id,
        nickname,
        imageUrl,
      }, process.env.JWT_SECRET_KEY, {
        expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN)
      });

      req.token = newAccessToken;
      next();
    }

    const err = new Error(ERROR.AUTHENTICATION_FAILED);

    err.status = 401;
    return next(err);
  }
};
