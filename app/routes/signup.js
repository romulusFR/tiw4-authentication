const express = require('express');
const db = require('../models/queries');
const createError = require('http-errors');
let router = express.Router();

router.get('/', function(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});


router.post('/', async function(req, res, next) {
  try {
    await db.addUser(req.body.username, req.body.email, req.body.password);
    res.redirect('/');
  }
  catch(e) {
    next(createError(500,e));
  }

});


module.exports = router;
