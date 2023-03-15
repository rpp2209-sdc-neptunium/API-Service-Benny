
var models = require('../models/index.js');

module.exports = {
  get: (req, res) => {
    req.query.page = req.query.page || 1;
    req.query.count = req.query.count || 5;
    req.query.limit = req.query.count * req.query.page;
    models.reviews.getAll(req.query)
    .then((data) => {
      let response = {};
      response.product = req.query.product_id;
      response.page = req.query.page;
      response.count = req.query.count;
      response.results = data.rows
      res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(400);
    })
  },

  getMeta: async (req, res) => {
    try {
      var characteristics = await models.reviews.getCharacteristics(req.query);
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
};