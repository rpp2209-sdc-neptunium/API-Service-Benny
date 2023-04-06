module.exports = (req, data) => {
  let response = {};
  response.product = req.query.product_id;
  response.page = req.query.page;
  response.count = req.query.count;
  response.results = data.rows
  return response;
};