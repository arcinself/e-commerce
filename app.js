const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

const mysql = require('./../Ecommerce/lib/datacenter/mysql/connection.js');
const alert = require('./lib/sentry/sentry');

const attributesRouter = require('./routes/attributes');
const categoriesRouter = require('./routes/categories');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const shoppingCartsRouter = require('./routes/shoppingcart');

alert();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mysql.connect();

app.use('/attributes', attributesRouter);
app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/shoppingcart', shoppingCartsRouter);

// catch 404 and forward to error handler;
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
