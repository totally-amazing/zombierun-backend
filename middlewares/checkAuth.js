const jwt = require('jsonwebtoken');

const config = require('../config');
const { ERROR } = require('../constants');
const TokenService = require('../service/token');

const createAuthMiddleware = (tokenService) => async (req, res, next) => {
  const authHeader = req.get('Authorization');
  console.log(authHeader);

  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).send(ERROR.AUTHENTICATION_FAILED);
  }

  const accessToken = authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send(ERROR.AUTHENTICATION_FAILED);
  }

  try {
    const { id } = jwt.verify(accessToken, config.jwt.sercetKey);
    req.userId = id;
    req.token = accessToken;

    next();
  } catch (error) {
    if (error.name !== ERROR.TOKEN_EXPIRED) {
      return res.status(401).send(ERROR.AUTHENTICATION_FAILED);
    }

    const user = await tokenService.getUserByExpiredToken(accessToken);

    if (!(user && tokenService.isTokenValid(user.refreshToken))) {
      return res.status(401).send(ERROR.AUTHENTICATION_FAILED);
    }

    tokenService.setUser(user);
    const newAccessToken = tokenService.createAccessToken();
    req.userId = user.id;
    req.token = newAccessToken;

    next();
  }
};
const tokenService = new TokenService();

exports.createAuthMiddleware = createAuthMiddleware;
exports.checkAuth = createAuthMiddleware(tokenService);
