let express = require('express');
const { route } = require('express/lib/application');
let router = express.Router();
let databaseConection = require('../lib/database');

router.get('/', function (req, res, next) {
    //
    // /products -> pasirenka atitinkama funkcija kuria reikia ivykdti ir grazina atsakyma atvaizdavimui
    // /products kreipiasi i kontroleri, kontroleris kreipiasi i duomenu baze(modeli) ir grazina is modelio atsakyma
    databaseConection.query('SELECT * FROM employees_employees', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('employees', { data: 'test' });
        } else {
            res.render('employees', { data: rows }); //data:rows yra sql uzklausos rezultatas kaip JSON masyvas
        }
    });
});
router.get('/show/(:employeeNumber)', function (req, res, next) {

    // SELECT * FROM `employees_employees` ee
    // LEFT JOIN offices o
    // ON o.officeCode = ee.officeCode
    // WHERE ee.employeeNumber = (:employeeNumber)
    let employeeNumber = req.params.employeeNumber;

    databaseConection.query('SELECT * FROM employees_employees ee LEFT JOIN offices o ON o.officeCode = ee.officeCode WHERE ee.employeeNumber =' + employeeNumber, function (err, rows) {
        if (err) throw err;

        if (rows.lenght <= 0) {
            req.flash('error', 'Toks darbuotojas nerastas');
            res.redirect('/employees');
        } else {
            res.render('employees/show', {
                employeeNumber: rows[0].employeeNumber,
                lastName: rows[0].lastName,
                firstName: rows[0].firstName,
                email: rows[0].email,
                jobTitle: rows[0].jobTitle,
                reportToLastName: rows[0].reportToLastName,
                reportToFirstName: rows[0].reportToFirstName,
                reportTojobTitle: rows[0].reportTojobTitle,
                city: rows[0].city,
                phone: rows[0].phone,
                addressLine1: rows[0].addressLine1,
                postalCode: rows[0].postalCode
            });
        }

    });
});

module.exports = router;