module.exports = (req, res, next) => {
  // let's not mess with auth for now
  if (req.path == "/auth") {
    // login works 50% of the time
    if (Math.random() > 0.5) {
      res.sendStatus(401);
    }
    return next();
  }

  // random server errors
  if (Math.random() > 0.9) {
    // 10% server errors
    return res.sendStatus(500);
  }
  if (Math.random() > 0.8) {
    // 10% forbidden
    return res.sendStatus(403);
  }
  if (Math.random() > 0.7) {
    //  10% not found
    return res.sendStatus(404);
  }

  if (Math.random() > 0.3) {
    // 10% timeout
    req.setTimeout(10);
    return setTimeout(next, 100);
  }
  next();
};
