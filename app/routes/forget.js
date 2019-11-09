const express = require('express');
const { checkEmail } = require('./authenticate');

const router = express.Router();

router.get('/', function loginHandler(_req, res, _next) {
  res.render('forget', { title: 'TIW4 -- LOGON' });
});

router.post('/', checkEmail);

router.post('/', function loginHandler(req, res, _next) {
  res.render('email', { tk: req.token });
});

module.exports = router;
