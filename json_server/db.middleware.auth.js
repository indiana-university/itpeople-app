module.exports = (req, res, next) => {
  
    if (!req.get("Authorization") && req.path != "/auth") {
      res.sendStatus(401)
    } 

    next()
}
