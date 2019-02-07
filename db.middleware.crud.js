module.exports = (req, res, next) => {
  if (res.method === 'POST') {
    res.sendStatus(201);
    res.send()
  }
  next()
}