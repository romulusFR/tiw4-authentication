const debug = require('debug')('app:server');
const app = require('./app');
require('dotenv').config();

const httpPort = process.env.PORT || '3000';

// https://docs.npmjs.com/misc/scripts#packagejson-vars
const version = process.env.npm_package_version;
const name = process.env.npm_package_name;

app.listen(httpPort, () => {
  debug(`Server ${name} v${version} is up and running on port ${httpPort}`);
});
