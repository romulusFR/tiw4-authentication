const express = require('express');
const path = require('path');
let router = express.Router();

router.get('/', function(_req, res, _next) {
    res.sendFile('signup.html', {
    root: path.join(__dirname, '../public')
  })
});


module.exports = router;
