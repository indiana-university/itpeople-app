const { Container } = require("rivet-react");

module.exports = (req, res, next) => {
  const db = getDb();

  if (req.method == "DELETE") {
    // Just say all deletes succeed, except for unit archiving requests, which are special.
    if(req.path.startsWith("/units/") && req.path.endsWith("/archive")) {
      const pathParts = req.path.split("/");
      const unitId = pathParts[2];
      
      const unit = db.units.find(u => u.id == unitId);
      if(!unit)
      {
        res.status(404);
        return next();
      }

      // Flip the active bit
      unit.active = !unit.active;
      
      // Write the changes to db.json
      saveToDb("units", unit);

      // Return the unit with a 200 OK
      return res.send(unit);
    }
    
    next();
    res.status(204);
    return res.end();
  }

  if(req.method == "POST" && req.path.startsWith("/memberTools") && req.path.endsWith("/memberTools"))
  {
    // If someone assigns a tool to Li’l Sebastian throw a 400 error to handle.
    console.log(req.body);
    // let body = JSON.parse(req.body);
    let membership = db.memberships.find(m => m.id == req.body.membershipId);
    if(membership == null){
      res.status(404);
      return next();
    }

    let person = db.people.find(p => p.id == membership.personId);
    if(person == null){
      res.status(404);
      return next();
    }
    
    if(person.netId == "lsebastian") {
      res.status(400);
      // console.log(res);
      let error = {
        "statusCode": 400,
        "errors": [ "Li’l Sebastian is a horse, and cannot use tools." ],
        "details": "Enough horsing around."
      };
      return res.send(error);
    }
  }

  // GET /people/**
  if (req.method != "GET") {
    return next();
  }

  if (req.path.startsWith("/people/")) {
    const pathParts = req.path.split("/");
    const username = pathParts[2];
    const person = Number.isInteger(+username) ? db.people.find(p => p.id == +username) : db.people.find(p => p.netId == username);

    if (!person) {
      res.status(404);
      return next();
    }

    // "/people/:id/memberships": "/memberships?personId=:id&_expand=unit",
    const memberships = db.memberships
      .filter(m => m.personId == person.id)
      .map(m => {
        return { ...m, unit: db.units.find(u => (u.id = m.unitId)) };
      });
    if (pathParts[3] == "memberships") return res.send(memberships);

    // "/people/:id": "/people/:id?_expand=department",
    person.department = db.departments.find(d => (d.id = person.departmentId));
    if (!pathParts[3]) return res.send(person);
  }

  return next();
};

function getDb() {
  const fs = require("fs");
  var path = require("path");
  var jsonPath = path.join(__dirname, "..", "src", "db.json");
  let rawdata = fs.readFileSync(jsonPath);
  return JSON.parse(rawdata);
}

function saveToDb(container, item) {
  const fs = require("fs");
  var path = require("path");
  var jsonPath = path.join(__dirname, "..", "src", "db.json");
  
  var db = getDb();
  // Find and update item.
  for(let ix in db[container]) {
    let dbItem = db[container][ix]
    if(dbItem.id == item.id)
    {
      db[container][ix] = item;
      break;
    }
  }

  // Write changes to path.
  fs.writeFileSync(jsonPath, JSON.stringify(db, null, 2));
}
