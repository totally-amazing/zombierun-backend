const jwt = require('jsonwebtoken');
const User = require('../models/User');

const TOKEN_EXPIRED_ERROR = 'TokenExpiredError';

const vertifyToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];

    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.JWT_SECRET_KEY
    );

    const { id, nickname, imageUrl } = decodedAccessToken;

    const user = await User.findById(id);

    const { refreshToken } = user;

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_KEY,
      async (error, decoded) => {
        if (error) {
          if (error.name === TOKEN_EXPIRED_ERROR) {
            const newRefreshToken = jwt.sign(
              {
                id,
                nickname,
                imageUrl,
              },
              process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
              {
                expiresIn: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
              }
            );

            user.refreshToken = newRefreshToken;
            await user.save();
            req.user = { id, nickname, imageUrl };
            return next();
          }
          error.status = 401;
          return next(error);
        }

        req.user = { id, nickname, imageUrl };
        return next();
      }
    );
  } catch (error) {
    const accessToken = req.headers.authorization.split(' ')[1];

    if (error.name === TOKEN_EXPIRED_ERROR) {
      const expiredDecodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET_KEY,
        { ignoreExpiration: true }
      );

      const { id, nickname, imageUrl } = expiredDecodedAccessToken;

      const user = await User.findById(id);

      const { refreshToken } = user;

      jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          err.status = 401;
          return next(err);
        }

        const newAccessToken = jwt.sign(
          {
            id,
            nickname,
            imageUrl,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: Number(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN),
          }
        );

        req.token = newAccessToken;
        req.user = { id, nickname, imageUrl };
        return next();
      });
    } else {
      error.status = 401;
      return next(error);
    }
  }
};

module.exports = vertifyToken;
