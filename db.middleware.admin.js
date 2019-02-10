module.exports = (req, res, next) => {
  // Admin with read/write/create/delete permission to every resource
  if (!req.get("Authorization")) {
    res.sendStatus(401);
  } else {
    res.header("Access-Control-Expose-Headers", "X-User-Permissions");
    res.header("X-User-Permissions", "GET, PUT, POST, DELETE");
    next();
  }
};
