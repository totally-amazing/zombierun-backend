class TokenService {
  constructor() {
    this._id = null;
    this._nickname = null;
    this._imageUrl = null;
  }

  setUser = (user) => {
    this._id = user.id;
    this._nickname = user.nickname;
    this._imageUrl = user.imageUrl;
  };

  createAccessToken = () => {
    return 'accessToken';
  };

  createRefreshToken = () => {
    return 'refreshToken';
  };

  getUserByExpiredToken = async () => {
    return {
      id: 'id',
      nickname: 'nicknam',
      imageUrl: 'imageUrl',
      refreshToken: 'refreshToken',
    };
  };

  isTokenValid = () => true;
}

module.exports = TokenService;
