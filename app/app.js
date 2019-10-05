// const debug = require('debug')('app');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// custom 404
app.use(function(req, res, _next) {
  res.status(404).sendFile('error_404.html', {
    root: path.join(__dirname, './public')
  })
});

module.exports = app;
