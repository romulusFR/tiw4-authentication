const express = require('express');
// const path = require('path');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TIW4 -- LOGON' });
  // res.sendFile('index.html', {
  //   root: path.join(__dirname, './')
  // })
});


module.exports = router;
