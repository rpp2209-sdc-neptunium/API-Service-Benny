module.exports = (param) => {
  param.page = param.page || 1;
  param.count = param.count || 5;
  param.limit = param.count * param.page;
  if (param.sort === 'helpful') {
    param.sort = 'helpfulness DESC';
  } else if (param.sort === 'newest') {
    param.sort = 'date DESC';
  } else if (param.sort === 'relevant') {
    param.sort = 'helpfulness DESC, date DESC';
  } else {
    param.sort = 'helpfulness DESC';
  }

  if (param.product_id === 'test') {
    const randomNumber = Math.floor(Math.random() * (360000 - 300000 + 1)) + 300000;
    param.product_id = randomNumber;
  }
  return param;
};