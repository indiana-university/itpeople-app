module.exports = (req, res, next) => {
  // let's not mess with auth for now
  if (req.path == "/auth") {
    return next();
  }

  // random server errors
  if (Math.random() > 0.9) {
    res.sendStatus(500);
  }
  if (Math.random() > 0.8) {
    res.sendStatus(403);
  }
  if (Math.random() > 0.7) {
    res.sendStatus(404);
  }

  next();
};
