let admin_middleware = require ('./db.middleware.admin')
let user_middleware = require ('./db.middleware.user')
let leader_middleware = require ('./db.middleware.leader')

module.exports = (req, res, next) => {
    // Default is admin with read/write/create/delete permission to every resource
    switch (req.path) {
        case '/units/1':
            return user_middleware(req, res, next)
        case '/units/4':
            return leader_middleware(req, res, next)
        default:
            return admin_middleware(req, res, next)
    }
}