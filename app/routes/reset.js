const express = require('express');
const { checkToken } = require('./authenticate');

const router = express.Router();

router.get('/', checkToken);

router.get('/', function loginHandler(req, res, _next) {
  res.render('reset', { tk: req.body.token });
});

router.post('/', checkToken);

// router.post('/', resetPassword);

router.post('/', function loginHandler(req, res, _next) {
  res.redirect('/login');
});

module.exports = router;
