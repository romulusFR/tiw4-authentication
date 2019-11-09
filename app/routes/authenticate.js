const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const sha512 = require('js-sha512');
const db = require('../models/queries');

const jwtServerKey = process.env.SECRET_KEY || 'secretpassword';
const jwtExpirySeconds = 60;

// call postgres to verify request's information

async function authenticateUser(req, res, next) {
  const login = req.body.username;
  const pwd = req.body.password;
  const pwdSha512 = sha512(pwd);
  const response = { title: 'TIW4 -- LOGON' };
  debug(`authenticate_user(): attempt from "${login}" with password "${pwd}"`);
  try {
    // Réccupérer le mot de passe depuis la base de données
    const passwordJsonFromDB = JSON.stringify(
      await db.getPasswordByUsername(login)
    );
    // Si l'utilisateur n'existe pas
    if (passwordJsonFromDB === undefined) {
      response.loginError = true;
      res.render('login', response);
      return;
    }

    const passwordFromDB = JSON.parse(passwordJsonFromDB).password;

    // Comparer le mot de passe saisie par l'utilisateur et le mot de passe récupérer depuis la base
    const similar = bcrypt.compareSync(pwdSha512, passwordFromDB); // true

    // si le mot de passe ne correspond à l'utilisateur siaisie
    if (!similar) {
      response.loginError = true;
      res.render('login', response);
      return;
    }
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
    return _res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, jwtServerKey);

    if (!payload.sub) return _res.redirect('/login');

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
