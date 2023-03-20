module.exports = (rating) => {
  for (var i = 0; i <= 5; i++) {
    if (rating[i] === undefined) {
      rating[i] = 0;
    }
  }
  return rating;
}