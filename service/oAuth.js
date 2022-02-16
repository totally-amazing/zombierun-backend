const { OAuth2Client } = require('google-auth-library');

const config = require('../config');

class OAuthService {
  static getAccountFromIdToken = async (idToken) => {
    const { clientId } = config.google;
    const client = new OAuth2Client(clientId);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    return payload && payload.email
      ? {
          uid: payload.sub,
          email: payload.email,
          imageUrl: payload.picture,
          nickname: payload.name,
        }
      : null;
  };
}

module.exports = OAuthService;
