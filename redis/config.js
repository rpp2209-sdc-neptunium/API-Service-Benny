const redis = require('redis');

//rememebr to pass in production url;
const redisClient = redis.createClient(
  process.env.redis_host,
  process.env.redis_port
);

redisClient.connect()
  .then(() => {
    console.log('redis connected')
  })
module.exports = redisClient;