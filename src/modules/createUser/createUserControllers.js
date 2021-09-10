const createUser = require('./createUserService')
exports.createUser = (req, res) => {
    createUser.createUser(req, res);
}