var fs = require('fs');
const moment = require('moment');
const host = "http://localhost:3000/";

exports.imageUpload = (req, res) => {
    let response = {};
    let token = req.headers.token
    console.log(token);
    let query = "SELECT id as user_id, type as user_type, email as user_name, date_created as timestamp FROM users WHERE token = '" + token + "' AND active = '1' AND blocked = '0'";
    req.app.locals.db.query(query, async(error, result) => {
        if (error) {
            response.success = false
            response.message = "Error in DB connection"
            return req.app.locals.helpers.validationError(res, response);
        } else {
            if (result.length > 0) {
                let userID = result[0].user_id;
                let user = result[0]
                let png = req.body.base64;
                let picName = req.body.picName;
                fs.writeFile('./public/uploads/' + picName + '.png', png, 'base64', function(err) {
                    if (err) {
                        response.success = false
                        response.message = "Error occured while uploading the data"
                        response.error = err
                        return req.app.locals.helpers.validationError(res, response);
                    } else {
                        let dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                        let link = host + "public/uploads/" + picName + ".png"
                        query = "INSERT INTO images (image, user_id, date_time) VALUES ('" + link + "', '" + userID + "', '" + dateTime + "')";
                        req.app.locals.db.query(query, async(error, result) => {
                            if (error) {
                                response.success = false
                                response.error = error
                                response.message = "Error in DB connection"
                                return req.app.locals.helpers.validationError(res, response);
                            } else {
                                let query = "SELECT id, image, user_id FROM images WHERE user_id = '" + userID + "'";
                                req.app.locals.db.query(query, async(error, result) => {
                                    if (error) {
                                        response.success = false
                                        response.error = error
                                        response.message = "Error in DB connection"
                                        return req.app.locals.helpers.validationError(res, response);
                                    } else {
                                        if (result.length > 0) {
                                            response.success = true
                                            response.message = 'Picture has successfully uploaded';
                                            response.data = user
                                            response.data.images = result
                                            return req.app.locals.helpers.success(res, response);
                                        }
                                    }
                                })
                            }
                        })
                    }
                });
            } else {
                response.success = false
                response.message = "user is not authorized";
                return req.app.locals.helpers.validationError(res, response);
            }
        }
    })

}