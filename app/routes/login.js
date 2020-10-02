const express = require('express');
const { authenticateUser } = require('./authenticate');

const router = express.Router();

router.get('/', function loginHandler(_req, res, _next) {
  res.render('login', {});
});

router.post('/', authenticateUser);

router.post('/', function loginHandler(_req, res, _next) {
  res.redirect('/restricted');
});

module.exports = router;
