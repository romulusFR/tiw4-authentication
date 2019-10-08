const express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.render('index', { title: 'TIW4 -- LOGON' });
});

module.exports = router;
