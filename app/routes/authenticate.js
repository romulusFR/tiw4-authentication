const jwt = require('jsonwebtoken');
const sha = require('js-sha512');
const bcrypt = require('bcryptjs');
const redis = require('redis');
const bluebird = require('bluebird');
const debug = require('debug')('app:authenticate');
const createError = require('http-errors');
const db = require('../models/queries');

bluebird.promisifyAll(redis);

// client for redis database
const host = process.env.REDIS_HOST || '192.168.76.222';
const port = process.env.REDIS_PASS || 6379;
const client = redis.createClient(port, host);

// jwt and refresh token secret keys
// the keys must have a size > used algorithm size
const jwtTokenSecret = process.env.SECRET_KEY || 'secretpassword';
const refreshTokenSecret =
  process.env.REFRESH_SECRET || 'refreshsecretpassword';

// JWT expiry time and refresh Token expiry time
const jwtExpirySeconds = 60; // 1 min
const refreshTokenLifetime = 24 * 60 * 60; // 24h

// call postgres to verify request's information
// if OK, creates a jwt and stores it in a cookie, 401 otherwise
async function authenticateUser(req, res, next) {
  const login = req.body.username;
  const pwd = sha(req.body.password);
  const response = { title: 'TIW4 -- LOGON' };

  debug(`authenticate_user(): attempt from "${login}" with password "${pwd}"`);
  try {
    const passwordJsonFromDB = JSON.stringify(
      await db.getPasswordByUsername(login)
    );
    if (!passwordJsonFromDB) {
      response.loginError = true;
      res.render('login', response);
      return;
    }

    const passwordFromDB = JSON.parse(passwordJsonFromDB).password;
    const ok = bcrypt.compareSync(pwd, passwordFromDB);

    // const ok = await db.checkUser(login, pwd);

    if (!ok) {
      response.loginError = true;
      res.render('login', response);
      return;
    }
    // Create a new token
    const token = jwt.sign({ sub: login }, jwtTokenSecret, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds
    });
    // Create a new refreshToken
    const refreshToken = jwt.sign({ sub: login }, refreshTokenSecret, {
      algorithm: 'HS256',
      expiresIn: refreshTokenLifetime
    });

    // Add the jwt into a cookie for further reuse
    // see https://www.npmjs.com/package/cookie
    res.cookie('token', token, {
      // secure: true,
      sameSite: true,
      httpOnly: true,
      maxAge: jwtExpirySeconds * 1000 * 2
    });

    // Add refresh token to the cookie
    res.cookie('refreshToken', refreshToken, {
      // secure: true,
      sameSite: true,
      httpOnly: true,
      maxAge: refreshTokenLifetime * 1000 * 2
    });
    debug(`authenticate_user(): "${login}" logged in ("${token}")`);
    next();
  } catch (e) {
    next(createError(500, e));
  }
}

// checks if jwt is present and pertains to some user.
// stores the value in req.user
// eslint-disable-next-line consistent-return
function checkUser(req, res, next) {
  const { token } = req.cookies;
  debug(`check_user(): checking token "${token}"`);

  if (!token) {
    return res.redirect('/login');
    // return next(createError(401, 'No JWT provided'));
  }

  try {
    const payload = jwt.verify(token, jwtTokenSecret);

    if (!payload.sub) {
      return res.redirect('/login');
      // next(createError(403, 'User not authorized'));
    }

    debug(`check_user(): "${payload.sub}" authorized`);
    req.user = payload.sub;
    return next();
  } catch (e) {
    if (
      e instanceof jwt.JsonWebTokenError ||
      e instanceof jwt.TokenExpiredError ||
      e instanceof jwt.NotBeforeError
    ) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      next(createError(401, e));
    } else {
      // otherwise, return a bad request error
      next(createError(400, e));
    }
  }
}

// checks if refreshToken is present and valid.
// if it is, create new access token
// else the user need to login again
function renewToken(req, res, next) {
  const { refreshToken } = req.cookies;

  debug(`renew_token(): checking refresh token before renewing jwt`);

  if (!refreshToken) {
    debug(`renew_token(): no refresh token found!`);
    next();
  }

  // check if refresh token is blacklisted
  // if it is, we don't generate new token
  client.get(refreshToken, (err, ret) => {
    if (ret) {
      debug(`renew_token(): refresh token ${ret} is blacklisted `);
    } else {
      debug(
        `renew_token(): generate new token with the provided refresh token ${refreshToken}`
      );
      // verify integrity of refresh token
      const refreshPayload = jwt.verify(refreshToken, refreshTokenSecret);

      // verify user agent
      if (refreshPayload.agent !== req.headers['user-agent']) {
        debug(
          `renew_token(): user ${refreshPayload.sub} is not using the same machine, you should notify him`
        );
      }

      // verify that the token expires soon or already expired before generating new one*
      // if not, no token is generated
      const payload = jwt.verify(refreshToken, refreshTokenSecret, {
        ignoreExpiration: true
      });
      const nowUnixSeconds = Math.round(Number(new Date()) / 1000);

      if (payload && payload.exp && payload.exp - nowUnixSeconds > 30) {
        // generate new acces token
        const newToken = jwt.sign({ sub: refreshPayload.sub }, jwtTokenSecret, {
          algorithm: 'HS256',
          expiresIn: jwtExpirySeconds
        });

        // update cookie
        res.cookie('token', newToken, {
          sameSite: true,
          httpOnly: true,
          maxAge: jwtExpirySeconds * 1000 * 2
        });
      }
    }
    next();
  });
}

// logout the user and add refresh token to blacklist
function blacklistToken(req, res, next) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    next(createError(401, 'No JWT provided'));
  }

  const refreshPayload = jwt.verify(refreshToken, refreshTokenSecret);

  if (!refreshPayload) {
    next(createError(401, 'Invalid refresh token'));
  }

  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  const expiration = refreshPayload.exp - nowUnixSeconds;

  // add refresh token to blacklist
  client.set(refreshToken, refreshToken, 'EX', expiration);

  // destroy the token and the cookie
  // https://stackoverflow.com/questions/27978868/destroy-cookie-nodejs
  res.cookie('token', jwt.sign({}, 'expired'), { maxAge: Date.now() });

  next();
}

// check if user email exists
// if it is, generate password reset token and send it to user
function checkEmail(req, _res, next) {
  // recuperer le mail
  const { email } = req.body;
  debug(`user email ${email}`);

  // verify that email exists
  // generate 24h token for password reset
  req.token = jwt.sign({ ident: email }, jwtTokenSecret, {
    expiresIn: 24 * 60 * 60
  });
  // send page by email
  next();
}

// check reset Token
function checkToken(req, _res, next) {
  const { token } = req.query;

  // verify token
  const payload = jwt.verify(token, jwtTokenSecret);
  debug(`email : ${payload.ident}`);

  next();
}

module.exports = {
  checkUser,
  authenticateUser,
  renewToken,
  blacklistToken,
  checkEmail,
  checkToken
};
