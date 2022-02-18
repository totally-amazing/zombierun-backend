const jwt = require('jsonwebtoken');

const config = require('../config');
const { ERROR } = require('../constants');
const User = require('../models/User');

class TokenService {
  constructor() {
    this._id = null;
    this._nickname = null;
    this._imageUrl = null;
  }

  setUser = (user) => {
    if (!(user.id && user.nickname)) {
      throw new Error(`user의 id, nickname이 필요합니다 user: ${user}`);
    }

    this._id = user.id;
    this._nickname = user.nickname;
    this._imageUrl = user.imageUrl;
  };

  create = (expiresIn) => {
    if (!this._id) {
      throw new Error(ERROR.REQUIRED_SET_USER);
    }

    return jwt.sign(
      {
        id: this._id,
        nickname: this._nickname,
        imageUrl: this._imageUrl,
      },
      config.jwt.sercetKey,
      { expiresIn }
    );
  };

  createAccessToken = () => {
    return this.create(config.jwt.accessTokenExpiresIn);
  };

  createRefreshToken = () => {
    return this.create(config.jwt.refreshTokenExpiresIn);
  };

  getUserByExpiredToken = async (token) => {
    let user;

    try {
      const { id } = jwt.verify(token, config.jwt.sercetKey, {
        ignoreExpiration: true,
      });
      user = await User.findById(id);
    } catch (error) {
      user = null;
    }

    return user;
  };

  isTokenValid = (token) => {
    try {
      return jwt.verify(token, config.jwt.sercetKey);
    } catch (error) {
      return false;
    }
  };
}
module.exports = TokenService;
