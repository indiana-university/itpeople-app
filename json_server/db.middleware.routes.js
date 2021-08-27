const { Container } = require("rivet-react");

module.exports = (req, res, next) => {
  const db = getDb();

  if (req.method == "DELETE") {
    // Just say all deletes succed, except for unit archiving requests, which are special.
    var skip = false;
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
    if(skip == false)
    {
      next();
      res.status(204);
      return res.end();
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
