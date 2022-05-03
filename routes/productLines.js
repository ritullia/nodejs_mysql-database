let express = require('express')
const { route } = require('express/lib/router')
let router = express.Router()
let databaseConection = require('../lib/database')

router.get('/', function (req, res, next) {
    //
    // /products -> pasirenka atitinkama funkcija kuria reikia ivykdti ir grazina atsakyma atvaizdavimui
    // /products kreipiasi i kontroleri, kontroleris kreipiasi i duomenu baze(modeli) ir grazina is modelio atsakyma
    databaseConection.query('SELECT * FROM productlines', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('productlines', { data: 'test' });
        } else {
            res.render('productlines', { data: rows }); //data:rows yra sql uzklausos rezultatas kaip JSON masyvas
        }
    });
});

module.exports = router;