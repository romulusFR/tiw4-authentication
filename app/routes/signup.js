const express = require('express');
const fetch = require('node-fetch');
const createError = require('http-errors');
const stringify = require('nodemon');
const db = require('../models/queries');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});

router.post('/', async function signupHandler(req, res, next) {
  console.log(req.body);

  if (!req.body.captcha)
    return res.json({ success: false, msg: 'Please select captcha' });

  const secretKey = '6Lc-C8EUAAAAAGedsvT2hFda_mBdvInRMPAYp-tf';
  const response = req.body.captcha;

  // Verify URL
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${response}`;
  console.log(verifyURL);

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then((r) => r.json());

  // If not successful
  if (body.success !== undefined && !body.success)
    return res.json({ success: false, msg: 'Failed captcha verification' });

  // If successful
  await db.addUser(req.body.username, req.body.email, req.body.pw);
  return res.json({ success: true, msg: 'Captcha passed' });
});

module.exports = router;
