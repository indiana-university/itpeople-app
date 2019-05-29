module.exports = (req, res, next) => {

  // GET /people/**
  if (req.method != "GET") {
    return next();
  }

  const db = getDb();

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
  var path = require('path');
  var jsonPath = path.join(__dirname, '..', 'src', 'db.json');
  let rawdata = fs.readFileSync(jsonPath);
  return JSON.parse(rawdata);
}
