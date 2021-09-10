var express = require('express');
var router = express.Router();
const login = require('./../src/modules/login/loginControllers');


router.post('/', login.login);

module.exports = router;