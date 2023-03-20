var models = require('../models/index.js');

module.exports = {
  get: async (req, res) => {
    try {
      var characteristics = await models.characteristics.get(req.query);
      var recommend = await models.reviews.getRecommend(req.query);
      var ratings = await models.reviews.getRatings(req.query);

      var response = {
        'product_id': req.query.product_id,
        characteristics,
        recommend,
        ratings
      };

      res.status(200).json(response);
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  }
}
