const db = require("../src/db.json");
module.exports = (req, res, next) => {
  
  // look up person ID if netId provided when saving membership  
  if ((req.path = "/memberships") && (req.method == "POST" || req.method == "PUT") && req.body.netId) {
      const person = db.people.find(p => p.netId == req.body.netId)
      if(person) req.body.personId = person.id
  }    

  next()
}
