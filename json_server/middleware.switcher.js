let admin_middleware = require ('./db.middleware.admin')
module.exports = (req, res, next) => {
    // Default is admin with read/write/create/delete permission to every resource
    switch (req.path) {
        default:
            return admin_middleware(req, res, next)
    }
}