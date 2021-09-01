const mysql = require('mysql2');
//connection mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '251242',
    database: 'salafex'
});

module.exports = connection;