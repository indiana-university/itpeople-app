module.exports = (req, res, next) => {
  // Admin with read/write/create/delete permission to every resource
  res.header('Access-Control-Expose-Headers', 'X-User-Permissions');
  res.header('X-User-Permissions', 'GET, PUT, POST, DELETE');
  next()
}