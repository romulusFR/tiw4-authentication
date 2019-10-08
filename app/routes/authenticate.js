const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');
const createError = require('http-errors');
const db = require('../models/queries');

const jwtServerKey = process.env.SECRET_KEY || 'secretpassword';
const jwtExpirySeconds = 60;

// call postgres to verify request's information
// if OK, creates a jwt and stores it in a cookie, 401 otherwise
async function authenticateUser(req, res, next) {
  const { login } = req.body;
  const pwd = req.body.password;

  debug(`authenticate_user(): attempt from "${login}" with password "${pwd}"`);
  try {
    const ok = await db.checkUser(login, pwd);

    if (!ok) next(createError(401, 'Invalid login/password'));
    else {
      // inspiration from https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
      const payload = {
        sub: login
        // fiels 'iat' and 'exp' are automatically filled from  the expiresIn parameter
      };

      const header = {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      };

      // Create a new token
      const token = jwt.sign(payload, jwtServerKey, header);
      // Add the jwt into a cookie for further reuse
      // see https://www.npmjs.com/package/cookie
      res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 * 2 });

      debug(`authenticate_user(): "${login}" logged in ("${token}")`);
      next();
    }
  } catch (e) {
    next(createError(500, e));
  }
}

// checks if jwt is present and pertains to some user.
// stores the value in req.user
// eslint-disable-next-line consistent-return
function checkUser(req, _res, next) {
  const { token } = req.cookies;
  debug(`check_user(): checking token "${token}"`);

  if (!token) {
    return next(createError(401, 'No JWT provided'));
  }

  try {
    const payload = jwt.verify(token, jwtServerKey);

    if (!payload.sub) next(createError(403, 'User not authorized'));

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

module.exports = { checkUser, authenticateUser };
