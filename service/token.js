const jwt = require('jsonwebtoken');

const config = require('../config');
const { ERROR } = require('../constants');

class TokenService {
  constructor() {
    this.id = null;
    this.nickname = null;
    this.imageUrl = null;
  }

  setUser = (user) => {
    if (!(user.id && user.nickname)) {
      throw new Error(ERROR.REQUIRED_USER_INFO);
    }

    this.id = user.id;
    this.nickname = user.nickname;
    this.imageUrl = user.imageUrl;
  };

  createToken = (expiresIn) => {
    if (!this.id) {
      throw new Error(ERROR.REQUIRED_SET_USER);
    }

    return jwt.sign(
      {
        id: this.id,
        nickname: this.nickname,
        imageUrl: this.imageUrl,
      },
      config.jwt.sercetKey,
      { expiresIn }
    );
  };

  createAccessToken = () => {
    return this.createToken(config.jwt.accessTokenExpiresIn);
  };

  createRefreshToken = () => {
    return this.createToken(config.jwt.refreshTokenExpiresIn);
  };
}

module.exports = TokenService;
