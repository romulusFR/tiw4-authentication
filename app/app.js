// const debug = require('debug')('app:main');
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./models/queries');

require('dotenv').config();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let signupRouter = require('./routes/signup');

let app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// (async function(){
// const check = await db.checkUser('superadmin','iloveu\'');
// console.log(check);
// })();

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/signup', signupRouter);


// custom 404
// app.use(function(req, res, _next) {
//   res.status(404).sendFile('error_404.html', {
//     root: path.join(__dirname, './public')
//   })
// });

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
