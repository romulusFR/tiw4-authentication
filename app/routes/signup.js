const express = require('express');
const createError = require('http-errors');
const db = require('../models/queries');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', {});
});

router.post('/', async function signupHandler(req, res, next) {
  try {
    await db.addUser(req.body.username, req.body.email, req.body.password);
    res.redirect('/');
  } catch (e) {
    next(createError(500, e));
  }
});

module.exports = router;
