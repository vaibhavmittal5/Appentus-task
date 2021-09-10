const md5 = require('md5')
const jwt = require('jsonwebtoken');
const moment = require('moment');
let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")

exports.login = (req, res) => {
    let response = {};
    if (req != '') {
        let username = '';
        let password = '';
        let body = req.body;
        if (body.username && body.password) {
            username = body.username;
            password = body.password;
            if (body.password) {
                password = md5(password);
            }

        }
        let query = "SELECT id, name,email, mobile_number as mobileNumber, date_created as dateCreated, token FROM users WHERE email = '" + username + "' AND password = '" + password + "' AND active = '1' AND blocked = '0'";
        req.app.locals.db.query(query, async(error, result) => {
            if (error) {
                let response = {};
                response.message = "Error in DB connection"
                response.error = error;
                return req.app.locals.helpers.validationError(res, response);
            } else {
                if (result.length > 0) {
                    let userAllData = result[0];
                    let userTokenData = {
                        "id": result[0].id,
                        "name": result[0].name,
                        "email": result[0].email, //mandatory field for upadte in DB 
                        "mobileNumber": result[0].mobileNumber,
                        "date": date
                    }
                    generateAndStoreToken(req, userTokenData).then((result) => {
                        userAllData.token = result.token;
                        response.success = true
                        response.message = 'successfully fetch user data';
                        response.data = userAllData;
                        return req.app.locals.helpers.success(res, response);
                    }).catch((result) => {
                        return req.app.locals.helpers.error(res, result);
                    })
                } else {
                    //Invalid username and password
                    let response = {};
                    response.message = "Invalid username and password";
                    return req.app.locals.helpers.validationError(res, response);
                }
            }
        })
    } else {
        let response = {};
        response.message = "Bad Request : Missing some parameters";
        return req.app.locals.helpers.validationError(res, response);
    }
};

let generateAndStoreToken = (req, userTokenData) => {
    let response = {};
    return new Promise((resolve, reject) => {
        jwt.sign({ user: userTokenData }, "secretKey", (err, token) => {
            if (err) {
                response.success = false;
                response.message = "Error while generating Token";
                response.error = err;
                reject(response);
            } else {
                let query = "UPDATE users SET token ='" + token + "' WHERE email = '" + userTokenData.email + "'";
                req.app.locals.db.query(query, async(error, result) => {
                    if (error) {
                        console.log(error);
                        response.success = false;
                        response.error = error;
                        response.message = "Error in DB connection";
                        reject(response);
                    } else {
                        response.token = token;
                        return resolve(response);
                    }
                })
            }
        });
    })
}