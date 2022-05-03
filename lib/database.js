//susijungimas su mysql duomenu baze
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pasword: '',
    database: 'classicmodels'
})

connection.connect(function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Prisijungimas ivyko sekmingai')
    }
})

module.exports = connection
