const express = require('express');
const { check_user } = require('./authenticate');
let router = express.Router();

router.get('/', check_user);

router.get('/', function(req, res, _next) {
  res.render('restricted', { title: 'TIW4 -- LOGON', user: req.user });
});

module.exports = router;
