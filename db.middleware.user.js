module.exports = (req, res, next) => {
  res.header("Access-Control-Expose-Headers", "X-User-Permissions");
  let permissions = req.originalUrl == "/me" ? "GET, PUT" : "GET";
  res.header("X-User-Permissions", permissions);
  next();
};
