// prettier-ignore
const { JWT, JWK : { asKey } } = require('jose');
const debug = require('debug')('app:authenticate');
const createError = require('http-errors');
const crypto = require('crypto');
const db = require('../models/queries');

// JWK va faire un encodage base64 du secret
const jwtServerKey = asKey(crypto.randomBytes(16));
const jwtExpirySeconds = 60;
const issuerID = 'TIW4-SSI CA';

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
        sub: login,
        // fields 'iat' and 'exp' are automatically filled from  the expiresIn parameter
      };

      const options = {
        algorithm: 'HS256',
        issuer: issuerID,
        expiresIn: `${jwtExpirySeconds} s`,
        header: {
          typ: 'JWT',
        },
      };

      // Create a new token
      // https://github.com/panva/jose/blob/master/docs/README.md#jwtsignpayload-key-options
      const token = JWT.sign(payload, jwtServerKey, options);
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
    const payload = JWT.verify(token, jwtServerKey, {
      algorithms: ['HS256'],
      issuer: issuerID,
    });

    if (!payload.sub) next(createError(403, 'User not authorized'));

    debug(`check_user(): "${payload.sub}" authorized`);
    req.user = payload.sub;
    return next();
  } catch (err) {
    if (
      err.code === 'ERR_JWT_CLAIM_INVALID' ||
      err.code === 'ERR_JWT_MALFORMED' ||
      err.code === 'ERR_JWS_VERIFICATION_FAILED'
    ) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      next(createError(401, err));
    } else {
      // otherwise, return a bad request error
      next(createError(400, err));
    }
  }
}

module.exports = { checkUser, authenticateUser };
