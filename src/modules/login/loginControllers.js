const login = require('./loginService')

exports.login = (req, res) => {
    login.login(req, res);
}