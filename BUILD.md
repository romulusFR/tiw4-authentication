Documentation de développement
==============================


Postgres
---------

Montage du serveur
 
```bash
 sudo -u postgres -s
 createuser -D -e -P tiw4-auth
 # pass :  tiw4-auth
 
 createdb tiw4-auth -O tiw4-auth -e
 psql -d tiw4-auth -c "create extension pgcrypto;"
 
 exit

 #Login avec 
 psql -h localhost -U tiw4-auth -d tiw4-auth
```
 
Script de création de la table et quelques comptes d'exemple.

```sql
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
```

Sur l'applicatif NodeJS
----------------


### Initialisation


On scaffold avec <https://expressjs.com/en/starter/generator.html>, on simplifie un peu l'affaire et on enrichit le `package.json`.

```bash
npm -v
#6.11.3
node -v
#v10.16.3

# dans le dossier /app du dépôt
npm install
npm run dev
```



### Docs de référence

* <https://nodejs.org/docs/latest-v10.x/api/index.html>
* <https://expressjs.com/en/api.html>
* <https://pugjs.org/>
* <https://node-postgres.com/> (<https://www.npmjs.com/package/pg>)
* <https://www.npmjs.com/package/debug>
* <https://www.npmjs.com/package/morgan>
* <https://www.npmjs.com/package/http-errors>
* <https://www.npmjs.com/package/jsonwebtoken>
* <https://jwt.io/>




### Bonnes pratiques 

* <https://expressjs.com/en/guide/error-handling.html>
* <https://expressjs.com/en/advanced/best-practice-performance.html>
* <https://expressjs.com/en/advanced/best-practice-security.html>
* <https://github.com/i0natan/nodebestpractices>

### Exemples

* Tuto en 3 parties
   * <https://www.codementor.io/olawalealadeusi896/building-simple-api-with-es6-krn8xx3k6>
   * <https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7>
   * <https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-postgresql-db-and-jwt-3-mke10c5c5>
 * Auth minimaliste en express <https://github.com/expressjs/express/tree/master/examples/auth>


Montage VM
----------

```bash
sudo apt update
sudo apt upgrade

```