var express = require('express');
var router = express.Router();
const createUser = require('./../src/modules/createUser/createUserControllers');


router.post('/', createUser.createUser);

module.exports = router;