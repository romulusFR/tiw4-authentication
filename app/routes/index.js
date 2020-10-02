const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', function rootHandler(req, res, _next) {
  res.render('index', {});
});

module.exports = router;
