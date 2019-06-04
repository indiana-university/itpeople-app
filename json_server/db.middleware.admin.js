module.exports = (req, res, next) => {
    res.header("Access-Control-Expose-Headers", "X-User-Permissions")
    res.header("X-User-Permissions", "GET, PUT, POST, DELETE")
  next()
}
