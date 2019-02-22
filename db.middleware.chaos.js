module.exports = (req, res, next) => {
  if (req.path == "/auth") {
    // login works 50% of the time
    if (Math.random() > 0.5) {
      
      res.status(401);
      res.send({
        errors: ["Auth failed ⛔️", "🐵"]
      });
    }
    return next();
  }

  // random server errors
  if (Math.random() > 0.9) {
    // 10% server errors
    res.status(500);
    return res.send({
      errors: ["Server error", "🙉"]
    });
  }
  if (Math.random() > 0.8) {
    // 10% forbidden
    res.status(403);
    return res.send({
      errors: ["🙊"]
    });
  }
  if (Math.random() > 0.7) {
    //  10% not found
    res.status(404);
    return res.send({
      errors: ["This resource is not found", "🙈"]
    });
  }

  if (Math.random() > 0.6) {
    // 10% timeout - empty response
    req.setTimeout(10);
    return setTimeout(next, 100);
  }
  next();
};