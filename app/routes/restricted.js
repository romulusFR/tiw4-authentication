const express = require('express');
const { checkUser } = require('./authenticate');

const router = express.Router();

router.get('/', checkUser);

router.get('/', function restrictedHandler(req, res, _next) {
  res.render('restricted', { user: req.user });
});

module.exports = router;
