const { Pool } = require('pg');
const debug = require('debug')('app:postgres');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

pool.on('connect', (client) => {
  debug(`connected to the db with ${client.user}`);
});
pool.on('remove', (client) => {
  debug(`client ${client.user} removed`);
});

// the list of all users
async function getUsers() {
  debug(`getUsers() called`);
  result = await pool.query('SELECT username, email FROM users;');
  return result.rows;
};

// Boolean query to check a user/password
async function checkUser(user, pwd) {
  debug(`checkUser("${user}", "${pwd}") called`);
  result = await pool.query('SELECT  FROM users WHERE username=$1 AND password=$2;', [user, pwd]);
  return (result.rowCount === 1);
};

module.exports = {getUsers, checkUser};