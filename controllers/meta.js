const models = require('../models/index.js');
const redis = require('../redis/index.js');
const transformParam = require('./utils/transformParam.js')


module.exports = {
  get: async (req, res) => {
    //transform req.query
    var param = transformParam(req.query);
    var key = `meta?product_id=${param.product_id}`
    try {
      //if cache hits
      var isCached = await redis.getCached(key, res);
      console.log(isCached);
    } catch (err) {
      //if cache misses
      console.log(err);
      try {
        const [characteristics, recommend, ratings] = await Promise.all([models.characteristics.get(param), models.reviews.getRecommend(param), models.reviews.getRatings(param)]);
        var response = {
          'product_id': req.query.product_id,
          characteristics,
          recommend,
          ratings
        }
        redis.cache(key, response)
        res.status(200).json(response);
      } catch (err) {
        console.error(err);
        res.status(400);
      }
    }
  }
}
