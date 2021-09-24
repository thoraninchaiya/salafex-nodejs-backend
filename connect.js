const mysql = require('mysql2');
//connection mysql db
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '251242',
    database: 'salafex',
    queueLimit: 500
});


module.exports = connection;