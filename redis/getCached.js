const redisClient = require('./config.js');

module.exports = async (key, res) => {
  var isFound = false;
  try {
    const data = await redisClient.get(key);
    if (data !== null) {
      res.json(JSON.parse(data));
      isFound = true;
    }
  } catch (err) {
    console.error(err);
  }

  if (isFound) {
    return Promise.resolve('cache hit');
  } else {
    return Promise.reject('cache miss');
  }

}