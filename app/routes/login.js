const express = require('express');
const db = require('../models/queries');

let router = express.Router();

router.get('/', async function(_req, res, _next) {
    const result = await db.getUsers();
    res.render('users', { title: 'TIW4 -- LOGON', users : result});
});


module.exports = router;
