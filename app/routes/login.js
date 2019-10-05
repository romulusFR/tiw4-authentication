const express = require('express');
const {authenticate_user} = require('./authenticate');

let router = express.Router();


router.post('/', authenticate_user);

router.post('/', function(_req, res, _next) {
    res.redirect('/restricted');
});

router.get('/', function(_req, res, _next) {
  res.render('login', { title: 'TIW4 -- LOGON' });
});

module.exports = router;
