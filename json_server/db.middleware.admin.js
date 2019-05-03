const db = require("../src/db.json");
module.exports = (req, res, next) => {
  
  // lookup person ID if netId provided when saving membership
  if ((req.path = "/memberships") && (req.method == "POST" || req.method == "PUT") && req.body.netId) {
      const person = db.people.find(p => p.netId == req.body.netId);
      if(person) req.body.personId = person.id;
  }

  // Admin with read/write/create/delete permission to every resource
  if (!req.get("Authorization") && req.path != "/auth") {
    res.sendStatus(401);
  } else {
    res.header("Access-Control-Expose-Headers", "X-User-Permissions");
    res.header("X-User-Permissions", "GET, PUT, POST, DELETE");
  }

  next();
};
