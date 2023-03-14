module.exports = (req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.url}`);
  });
  next();
};