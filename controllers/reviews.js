var models = require('../models/index.js');
var transformParam = require('./utils/transformParam.js');
var transformResponse = require('./utils/transformResponse.js');
var redis = require('../redis/index.js');

module.exports = {
  get: (req, res) => {
    //normalize the req.query
    var param = transformParam(req.query);
    var key = `reviews?product_id=${param.product_id}`;

    redis.getCached(key, res)
      .then((cache) => {
        //if cache hits
        return;
      })
      .catch(() => {
        //if cache misses
        models.reviews.getAll(param)
          .then((data) => {
            var response = transformResponse(req, data);
            redis.cache(key, response);
            res.status(200).json(response);
          })
          .catch((err) => {
            console.error(err);
            res.status(400);
          })
      })
  },

  post: (req, res) => {
    models.reviews.post(req.body)
      .then((data) => {
        res.status(201).end();
      })
      .catch((err) => {
        console.error(err);
        res.json('err').status(400);
      })
  },

  updateHelpful: (req, res) => {
    models.reviews.updateHelpful(req.params.review_id)
      .then((data) => {
        res.status(201).end();
      })
      .catch((err) => {
        console.error(err);
        res.status(400);
      })
  },

  report: (req, res) => {
    models.reviews.report(req.params.review_id)
      .then((data) => {
        res.status(201).end();
      })
      .catch((err) => {
        console.error(err);
        res.status(400);
      });
  }
};