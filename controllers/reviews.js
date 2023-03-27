var models = require('../models/index.js');
var transformParam = require('./utils/transformParam.js');

module.exports = {
  get: (req, res) => {
    var param = transformParam(req.query);
    models.reviews.getAll(param)
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

  post: (req, res) => {
    models.reviews.post(req.body)
    .then((data) => {
      res.status(201).end();
    })
    .catch((err) => {
      console.error(err);
      res.status(400);
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