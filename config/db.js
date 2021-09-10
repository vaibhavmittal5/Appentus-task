const mysql = require("mysql");

var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appentus',
    port: '3306'
};

exports.pool = mysql.createPool(dbConfig)