const express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html', {
    root: path.join(__dirname, './')
  })
});


module.exports = router;
