const debug = require('debug')('app:main');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// read environnement variable in the ./.env file
require('dotenv').config();

const app = express();

// utiliser body parser pour parser JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Desactiver x-powered-by
app.disable('x-powered-by');

// use the https://pugjs.org/  view engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// see https://www.npmjs.com/package/morgan
app.use(morgan('dev'));

// see https://expressjs.com/en/api.html#express.json
// app.use(express.json());

// see https://expressjs.com/en/api.html#express.urlencoded
// to decode application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// see https://www.npmjs.com/package/cookie-parser
app.use(cookieParser());

// serve static content in ./public seen in ./ from the client's point of view
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const restrictedRouter = require('./routes/restricted');
const forgetRouter = require('./routes/forget');
const resetRouter = require('./routes/reset');
const refreshRouter = require('./routes/renew');

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);
app.use('/restricted', restrictedRouter);
app.use('/forget', forgetRouter);
app.use('/reset', resetRouter);
app.use('/refresh', refreshRouter);

app.use(function notFoundHandler(req, res, next) {
  debug(`handler 404: ${req.baseUrl}`);
  next(createError(404));
});

// error handler
app.use(function defaultHandler(err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  debug(`rendering error: ${err}`);

  // set status (500 is defualt) and renders the error page
  res.status(res.locals.status);
  res.render('error');
});

module.exports = app;
