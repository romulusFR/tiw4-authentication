Doc de construction
===================


Références
----------

 * <https://www.codementor.io/olawalealadeusi896/building-simple-api-with-es6-krn8xx3k6>
 * <https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7>
 * <https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-postgresql-db-and-jwt-3-mke10c5c5>

Plus loin

 * <http://www.passportjs.org/> <http://www.passportjs.org/docs/username-password/>

Postgres
---------

Montage du serveur
 
```bash
 sudo -u postgres -s
 createuser -D -e -P tiw4-auth
 # pass :  tiw4-auth
 
 createdb tiw4-auth -O tiw4-auth -e
 
 exit
```
 
Login avec `psql -h localhost -U tiw4-auth`

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userid integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password varchar(8) NOT NULL
);

INSERT INTO users(username, email, password) VALUES ('superadmin','mevin.kitnick@hotmail.com','iloveu');
INSERT INTO users(username, email, password) VALUES ('sandygeorge','sandy.george@hotmail.com','zuley03');
INSERT INTO users(username, email, password) VALUES ('griffonpress','griffonpress@gmail.com','Skylar7');
INSERT INTO users(username, email, password) VALUES ('politis','politis@hotmail.com','derby5');




NodeJS
------

 * <https://www.npmjs.com/package/pg> <https://node-postgres.com/>
 * alternative <https://www.npmjs.com/package/knex>

