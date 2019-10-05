const express = require('express');
// const path = require('path');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.render('restricted', { title: 'TIW4 -- LOGON' });
});


module.exports = router;
