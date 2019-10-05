const jwt = require('jsonwebtoken');
const express = require('express');
const debug = require('debug')('app:login');
const db = require('../models/queries');
const createError = require('http-errors');

let router = express.Router();

// inspiration from https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
const jwt_server_key = process.env.SECRET_KEY || 'ki3sohg1id7EeyaiQuoone6aicahmohK';
const jwt_expiry_seconds = 120;


router.post('/', async function(req, res, next) {
    const login = req.body.login;
    const pwd = req.body.password;
    const ok = await db.checkUser(login, pwd);

    if(!ok)
      next(createError(401));
    else {

      // Create a new token 
      const token = jwt.sign({ login }, jwt_server_key, {
        algorithm: 'HS256',
        expiresIn: jwt_expiry_seconds
      });

      debug(`token generated: ${token}`);

      // Add the jwt into a cookie for further reuse
      res.cookie('token', token, { maxAge: jwt_expiry_seconds * 1000 });
      res.redirect('/restricted');
    }


});

router.get('/', function(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    res.render('login', { title: 'TIW4 -- LOGON' });

  try {
    let payload = jwt.verify(token, jwt_server_key);
    debug(`payload.login: ${payload.login}`);
    res.redirect('/restricted');
  }
  catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      next(createError(401));
    }
    // otherwise, return a bad request error
    next(createError(400));
  }
});

module.exports = router;
