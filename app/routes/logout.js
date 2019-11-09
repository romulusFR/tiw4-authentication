const express = require('express');
const { checkUser, blacklistToken } = require('./authenticate');

const router = express.Router();

router.get('/', checkUser);

router.get('/', blacklistToken);

router.get('/', function loginHandler(_req, res, _next) {
  res.redirect('/');
});

module.exports = router;
