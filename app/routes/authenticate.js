const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');
const createError = require('http-errors');
const db = require('../models/queries');

const jwt_server_key = process.env.SECRET_KEY || 'secretpassword';
const jwt_expiry_seconds = 120;

// call postgres to verify request's information
// if OK, creates a jwt and stores it in a cookie, 401 otherwise
async function authenticate_user(req, res, next){
  const login = req.body.login;
  const pwd = req.body.password;

  debug(`authenticate_user(): attempt from "${login}" with password "${pwd}"`);
  try{
    const ok = await db.checkUser(login, pwd);

    if(!ok)
      next(createError(401));
    else{
      // inspiration from https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
      const payload ={ 
        login
      };

      const header = {
        algorithm: 'HS256',
        expiresIn: jwt_expiry_seconds
      }
      
      // Create a new token 
      const token = jwt.sign(payload, jwt_server_key, header);
      // Add the jwt into a cookie for further reuse
      res.cookie('token', token, { maxAge: jwt_expiry_seconds * 1000 });

      debug(`authenticate_user(): "${login}" logged in ("${token}")`);
      next();
    }
  }
  catch(e){
    next(e);
  }
}

// checks if jwt is present and pertains to some user.
// stores the value in req.user
function check_user(req, _res, next){
  const token = req.cookies.token;
  debug(`check_user(): checking token "${token}"`);

  if (!token)
    return next(createError(401));

  try {
    let payload = jwt.verify(token, jwt_server_key);
    

    if(!payload.login)
      next(createError(401));

    debug(`check_user(): "${payload.login}" authorized`);
    req.user = payload.login;
    next();
  }
  catch (e) {
    if (e instanceof jwt.JsonWebTokenError || e instanceof TokenExpiredError ||  e instanceof NotBeforeError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      next(createError(401));
    }
    else{
      // otherwise, return a bad request error
      next(createError(400));
    }
  }
}

module.exports = {check_user, authenticate_user};