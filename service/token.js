const jwt = require('jsonwebtoken');

const config = require('../config');

class TokenService {
  constructor({ id, nickname, imageUrl }) {
    this.id = id;
    this.nickname = nickname;
    this.imageUrl = imageUrl;
  }

  createToken = (expiresIn) => {
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
