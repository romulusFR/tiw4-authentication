const express = require('express');
const createError = require('http-errors');
const db = require('../models/queries');

const router = express.Router();

router.get('/', async function usersHandler(_req, res, next) {
  try {
    const result = await db.getUsers();
    res.render('users', { users: result });
  } catch (e) {
    next(createError(500, e));
  }
});

module.exports = router;
