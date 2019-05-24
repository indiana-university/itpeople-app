module.exports = (req, res, next) => {
  res.header("Access-Control-Expose-Headers", "X-User-Permissions");
  let permissions = "GET, PUT"
  res.header("X-User-Permissions", permissions);
  next();
};
