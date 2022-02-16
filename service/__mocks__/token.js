class TokenService {
  constructor({ id, nickname, imageUrl }) {
    this.id = id;
    this.nickname = nickname;
    this.imageUrl = imageUrl;
  }

  createToken = () => {};

  createAccessToken = () => {
    return 'accessToken';
  };

  createRefreshToken = () => {
    return 'refreshToken';
  };
}

module.exports = TokenService;
