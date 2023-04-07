const redisClient = require('./config');

const DEFAULT_EXPIRATION = 3000;
module.exports = async (key, data) => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: DEFAULT_EXPIRATION,
      NX: true
    });
  } catch (err) {
    console.error(err);
  }
  return;
}