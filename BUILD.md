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
 
Script de création de la table

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


NodeJS
------


On scaffold avec <https://expressjs.com/en/starter/generator.html>, on simplifie un peu l'affaire et on enrichit le `package.json`.

```bash
npm -v
#6.11.3
node -v
#v10.16.3
```

On utilise <https://node-postgres.com/> (<https://www.npmjs.com/package/pg>) pour l'accès à postgres


Montage VM
----------

```bash
sudo apt update
sudo apt upgrade

```