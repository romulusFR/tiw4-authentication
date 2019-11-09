const express = require('express');
const createError = require('http-errors');
const db = require('../models/queries');
const { checkUser } = require('./authenticate');

const router = express.Router();

router.get('/', checkUser);

router.get('/', async function usersHandler(_req, res, next) {
  try {
    const result = await db.getUsers();
    res.render('users', { title: 'TIW4 -- LOGON', users: result });
  } catch (e) {
    next(createError(500, e));
  }
});

module.exports = router;
