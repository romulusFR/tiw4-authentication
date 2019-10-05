const express = require('express');
const path = require('path');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.sendFile('index.html', {
    root: path.join(__dirname, '../public')
  })
});

module.exports = router;
