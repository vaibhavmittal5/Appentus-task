module.exports.validationError = (res, error = 'Data provided is not valid') => {
    res.statusCode = 422;
    res.end(JSON.stringify(error, null, 3));
};

module.exports.error = (res, error = 'An unknown error occurred', statusCode = 500) => {
    res.statusCode = statusCode;
    res.end(JSON.stringify(error, null, 3));
};

module.exports.success = (res, data = null) => {
    res.statusCode = 200;
    res.end(JSON.stringify(data, null, 3));
};