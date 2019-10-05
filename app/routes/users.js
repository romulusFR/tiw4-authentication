const express = require('express');
const db = require('../models/queries');
const createError = require('http-errors');

let router = express.Router();

router.get('/', async function(_req, res, next) {
    try {
      const result = await db.getUsers();
      res.render('users', { title: 'TIW4 -- LOGON', users : result});
    }
    catch(e){
      next(e);
    }

    
});


module.exports = router;
