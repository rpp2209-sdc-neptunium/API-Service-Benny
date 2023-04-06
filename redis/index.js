const redis = require('redis');

const redisClient = redis.createClient(/*pass in product url*/);

module.exports = redisClient;