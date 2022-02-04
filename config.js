const dotenv = require('dotenv');

dotenv.config();

function getEnv(key, defaultValue) {
  const value = process.env[key] || defaultValue;

  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }

  return value;
}

const config = {
  db: {
    host: getEnv('DB_HOST'),
  },
  google: {
    clientId: getEnv('GOOGLE_CLIENT_ID'),
  },
  port: Number(getEnv('PORT', 8080)),
  cors: {
    allowOrigin: getEnv('CORS_ALLOW_ORIGIN'),
  },
  jwt: {
    sercetKey: getEnv('JWT_SECRET_KEY'),
    accessTokenExpiresIn: getEnv('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    refreshTokenExpiresIn: getEnv('JWT_REFRESH_TOKEN_EXPIRES_IN'),
  },
};

module.exports = config;
