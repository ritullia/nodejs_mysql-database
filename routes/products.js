//products - atvaizduos visus produktus
//products/add - prides produktus
//products/delete - istrins produktus
//products/edit - redaguos

let express = require('express')
const { route } = require('express/lib/router')
let router = express.Router()
let databaseConection = require('../lib/database')


//products

router.get('/', function (req, res, next) {
    // products-->pasirenka atitinkama funkcija, kuria reikia ivykdyti ir grazina atsakyma atvaizdavimui
    // products kreipiasi i kontroleri, kontroleris i modeli(DB) ir grazina is modelio atsakyma

    databaseConection.query('SELECT * FROM products', function (err, rows) {
        if (err) {
            req.flash('error', err)
            res.render('products', { data: 'test' }) //nukreips i products vaizda
        } else {
            res.render('products', { data: rows })//{ data: rows }sql uzklausos rezultatas kaip JSON masyvas
        }
    })
})


//idejimo vaizdas
router.get('/add', function (req, res, next) {
    res.render('products/add', {
        productCode: '',
        productName: '',
        productLine: '',
        buyPrice: ''
    })          //add.ejs
});

//produkto idejimo veiksmas

router.post('/add', function (req, res, next) {

    let productCode = req.body.productCode;
    let productName = req.body.productName;
    let productLine = req.body.productLine;
    let buyPrice = req.body.buyPrice;

    let errors = false;

    if (productCode.length === 0 || productName.length === 0 || productLine.length === 0 || buyPrice.length === 0) {
        errors = true;
        req.flash('error', 'Visi laukeliai turi buti uzpildyti');

        res.render('products/add', {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        })
    }

    if (!errors) {
        let form_data = {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        }

        databaseConection.query('INSERT INTO products SET ?', form_data, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('products/add', {
                    productCode: form_data.productCode,
                    productName: form_data.productName,
                    productLine: form_data.productLine,
                    buyPrice: form_data.buyPrice
                })
            } else {
                req.flash('success', 'Product was added');
                res.redirect('/products');
            }
        });
    }
})


// produkto istrynimas
router.get('/delete/(:productCode)', function (req, res, next) {
    let productCode = req.params.productCode;
    databaseConection.query('DELETE FROM products WHERE productCode="' + productCode + '"', function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/products');
        } else {
            req.flash('success', 'Product ' + productCode + ' was deleted');
            res.redirect('/products');
        }
    });
});

// tiktai vieno produkto informacios atvaizdavimas
router.get('/edit/(:productCode)', function (req, res, next) {
    let productCode = req.params.productCode;
    // SELECT uzklausa
    // SELECT * FROM products WHERE productsCode = productCode
    databaseConection.query('SELECT * FROM products WHERE productCode="' + productCode + '"', function (err, rows, fields) {
        if (err) throw err

        if (rows.length <= 0) {
            req.flash('error', "No such product found")
            res.redirect('/products')

        } else {
            res.render('products/edit', {
                productCode: rows[0].productCode,
                productName: rows[0].productName,
                productLine: rows[0].productLine,
                buyPrice: rows[0].buyPrice
            })
        }
    })

})

// produkto redagavimas
router.post('/update/(:productCode)', function (req, res, next) {
    let productCode = req.params.productCode
    let productName = req.body.productName;
    let productLine = req.body.productLine;
    let buyPrice = req.body.buyPrice;
    let errors = false;

    if (productName.length === 0 || productLine.length === 0 || buyPrice.length === 0) {
        errors = true;
        req.flash('error', 'Please fill all inputs');

        res.render('products/edit', {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        })
    }

    if (!errors) {
        let form_data = {
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        }

        databaseConection.query('UPDATE products SET ? WHERE productCode="' + productCode + '"', form_data, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('products/edit', {
                    productCode: productCode,
                    productName: form_data.productName,
                    productLine: form_data.productLine,
                    buyPrice: form_data.buyPrice
                })
            } else {
                req.flash('success', 'Produktas redaguotas sekmingai')
                res.redirect('/products')
            }
        })
    }
})


//tiktai uz vieno produkto informacijos atvaizdavima
router.get('/statistics', function (req, res, next) {

    databaseConection.query('SELECT * FROM order_statistics', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('products/statistics', { data: '' });
        } else {
            res.render('products/statistics', { data: rows }); //data:rows yra sql uzklausos rezultatas kaip JSON masyvas
        }
    });
});


module.exports = router
