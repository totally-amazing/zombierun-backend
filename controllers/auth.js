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
      refreshToken: null,
    });
  }

  const tokenService = new TokenService({
    id: user.id,
    nickname: user.nickname,
    imageUrl: user.imageUrl,
  });

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
