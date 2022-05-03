//
// i narsykles suvedus nuoroda /products pamatyti visus produktus lenteleje

let createError = require('http-errors')
let express = require('express')
let path = require('path')
let flash = require('express-flash')
let session = require('express-session')
let mysql = require('mysql')
let connection = require('./lib/database')

let productsRouter = require('./routes/products')
let productLinesRouter = require('./routes/productlines');
let employeesRouter = require('./routes/employees');
let app = express()

//Nustatome atvaizdavimo mechanizma
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'

}))

app.use(flash())
app.use('/products', productsRouter)
app.use('/productlines', productLinesRouter);
app.use('/employees', employeesRouter)

app.use(function (req, res, next) {
    next(createError(404))
})

app.listen(3000)

