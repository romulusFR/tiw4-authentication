const express = require('express');
const { renewToken } = require('./authenticate');

const router = express.Router();

router.post('/', renewToken);

router.post('/', function loginHandler(req, res, _next) {
  res.status(200).end();
});

module.exports = router;
