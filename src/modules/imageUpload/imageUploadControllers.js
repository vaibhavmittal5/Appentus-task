const imageUpload = require('./imageUploadService')
exports.imageUpload = (req, res) => {
    imageUpload.imageUpload(req, res);
}