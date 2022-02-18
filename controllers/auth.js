const jwt = require('jsonwebtoken');
const config = require('../config');

const { ERROR } = require('../constants');
const User = require('../models/User');
const OAuthService = require('../service/oAuth');
const TokenService = require('../service/token');

exports.signIn = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, nickname, imageUrl } =
    await OAuthService.getAccountFromIdToken(idToken);
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      nickname,
      imageUrl,
      gameHistory: [],
    });
  }

  const tokenService = new TokenService();

  tokenService.setUser(user);

  const accessToken = tokenService.createAccessToken();
  const refreshToken = tokenService.createRefreshToken();

  await User.findByIdAndUpdate(user.id, { refreshToken });

  res.send({
    id: user.id,
    nickname: user.nickname,
    imageUrl: user.imageUrl,
    token: accessToken,
  });
};

exports.me = async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send(ERROR.USER_NOT_FOUND);
  }

  try {
    jwt.verify(user.refreshToken, config.jwt.sercetKey);
  } catch (error) {
    if (error.name === ERROR.TOKEN_EXPIRED) {
      const tokenService = new TokenService();
      tokenService.setUser(user);
      const refreshToken = tokenService.createRefreshToken();
      await User.findByIdAndUpdate(user.id, { refreshToken });

      return res.send({
        token: req.token,
        user: {
          id: user.id,
          nickname: user.nickname,
          imageUrl: user.imageUrl,
        },
      });
    }
  }

  res.send({
    token: req.token,
    id: user.id,
    nickname: user.nickname,
    imageUrl: user.imageUrl,
  });
};
