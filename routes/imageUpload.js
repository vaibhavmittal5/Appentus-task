var express = require('express');
var router = express.Router();
const imageUpload = require('./../src/modules/imageUpload/imageUploadControllers');


router.post('/', imageUpload.imageUpload);

module.exports = router;