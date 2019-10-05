const express = require('express');
const db = require('../models/queries');
const createError = require('http-errors');

let router = express.Router();

router.post('/', async function(req, res, next) {
    const ok = await db.checkUser(req.body.login, req.body.password);

    if(ok)
      res.redirect('/users');
    else
      next(createError(403));
});

router.get('/', function() {
  res.redirect('/');
});

module.exports = router;
