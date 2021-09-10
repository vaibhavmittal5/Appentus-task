const md5 = require('md5')
const moment = require('moment');
exports.createUser = (req, res) => {
    let response = {};
    if (req != '') {
        let name = '';
        let password = '';
        let email = '';
        let mobile = '';
        let body = req.body;
        if (body.name && body.password && body.email && body.mobile && body.rePassword) {
            name = body.name;
            email = body.email;
            mobile = body.mobile;
            if (body.rePassword === body.password && body.password.length > 7) {
                password = body.password;
                password = md5(password);
                let regexPhone = /^[6789]\d{9}$/
                let phoneValid = regexPhone.test(body.mobile)
                let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                let emailValid = regexEmail.test(body.email)
                if (phoneValid && emailValid) {
                    query = "SELECT * FROM users WHERE email = '" + email + "'";
                    req.app.locals.db.query(query, async(error, result) => {
                        if (result.length > 0) {
                            let response = {};
                            response.message = "this email is already exists";
                            return req.app.locals.helpers.validationError(res, response);
                        } else {
                            let date = moment(new Date()).format("YYYY-MM-DD")
                            query = "INSERT INTO users (name, email, password, mobile_number, active, blocked, date_created, token) VALUES ('" + name + "', '" + email + "', '" + password + "', '" + mobile + "', 1, 0, '" + date + "', '')";
                            req.app.locals.db.query(query, async(error, result) => {
                                if (error) {
                                    let response = {};
                                    response.message = "Error in DB connection"
                                    return req.app.locals.helpers.validationError(res, response);
                                } else {
                                    response.success = true
                                    response.message = 'successfully user has created';
                                    response.data = result[0]
                                    return req.app.locals.helpers.success(res, response);
                                }
                            })
                        }

                    })
                } else {
                    let response = {};
                    response.success = false
                    response.message = "Please enter valid email and mobile number";
                    return req.app.locals.helpers.validationError(res, response);
                }
            } else {
                let response = {};
                response.success = false
                response.message = "Password and Re-password does not match or password length less than 8 characters";
                return req.app.locals.helpers.validationError(res, response);
            }
        }
    } else {
        let response = {};
        response.message = "Bad Request : Missing some parameters";
        return req.app.locals.helpers.validationError(res, response);
    }
};