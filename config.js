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
    aindroidClientId: getEnv('ANDROID_CLIENT_ID'),
  },
  port: Number(getEnv('PORT', 8080)),
  cors: {
    allowOrigin: getEnv('CORS_ALLOW_ORIGIN'),
  },
};

module.exports = config;
