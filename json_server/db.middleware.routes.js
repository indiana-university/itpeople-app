const db = require("../src/db.json");
module.exports = (req, res, next) => {
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
    if (pathParts[3] == "memberships") res.send(memberships);

    // "/people/:id": "/people/:id?_expand=department",
    person.department = db.departments.find(d => (d.id = person.departmentId));
    if (!pathParts[3]) res.send(person);
  }
  next();
};
