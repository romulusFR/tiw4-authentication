TP TIW4 2019-2020 "authentification" : documentation de développement
=====================================================================

<!-- markdownlint-disable MD004-->
- [TP TIW4 2019-2020 "authentification" : documentation de développement](#tp-tiw4-2019-2020-authentification--documentation-de-développement)
  - [Installation générale](#installation-générale)
  - [Configuration nginx](#configuration-nginx)
  - [Configuration PostgreSQL](#configuration-postgresql)
  - [Configration Node.js](#configration-nodejs)
  - [Lancement de l'application Node.js](#lancement-de-lapplication-nodejs)
  - [Documentation Node.js](#documentation-nodejs)
<!-- markdownlint-enable MD004-->

On donne ici des informations sur le développement et le déploiement de l'application _LOGON_.

Installation générale
---------------------

Pour des versions à jour de Node.js, PostgresSQL et nginx.

```bash
# update générale
sudo apt update
sudo apt upgrade

# installation nginx
sudo add-apt-repository ppa:nginx/stable
sudo apt update
sudo apt-get install -y nginx nginx-doc

#  installation postgres-11
sudo echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee  /etc/apt/sources.list.d/pgdg.list > /dev/null
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt install postgresql-11

# installation node 10.x
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -  
sudo apt-get install -y nodejs  
```

Configuration nginx
-------------------

```bash
# on va configurer nginx en reverse proxy
cd /etc/nginx/sites-available/
sudo mv default default.back


# puis créer les deux fichiers de configuration ci-dessous
# [...]
```

Pour le fichier `/etc/nginx/sites-available/default`

```nginx
# Load balancing / server declaration
upstream nodejs {
    zone nodejs 64k;
    server localhost:3000;
}

# HTTP front for node
server {
    listen       80;
    server_name  _;

    location / {
       include /etc/nginx/conf.d/proxy_set_header.inc;
       proxy_pass http://nodejs;
    }
}
```

Pour le fichier `/etc/nginx/conf.d/proxy_set_header.inc`

```nginx
proxy_set_header X-Forwarded-By $server_addr:$server_port;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

A ce stade on a une 502 sur le port 80 car l'application n'est pas lancée

Configuration PostgreSQL
------------------------

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

Ci-après, le script de création de la table et quelques comptes d'exemple.

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

Configration Node.js
--------------------

```bash
npm -v
#6.11.3
node -v
#v10.16.3

# Manually change npm’s default directory : TRES RECOMMAND2
# https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

# installation globale du gestionnaire d'exécution node
npm install pm2@latest -g

# on clone l'app
git clone https://github.com/romulusFR/tiw4-authentication.git
cd tiw4-authentication/app

# On a scaffoldé avec <https://expressjs.com/en/starter/generator.html>
# on a simplifié un peu l'affaire et on a enrichi le `package.json`.
# tout est prêt
npm install

# on copie le fichier d'environnement
cp DEV_ENVIRONMENT .env
```

Lancement de l'application Node.js
----------------------------------

A partir d'ici, on ici on peut lancer l'app sur le port 3000 par défaut.
**C'est la seule chose à faire sur la VM qui vous est fournie.**

```bash
cd ~/tiw4-authentication/app
# si on veut lancer l'app en mode développement
npm run dev

# en mode production
pm2 start ./bin/www --name tiw4-auth
pm2 monit
```

Documentation Node.js
---------------------

* <https://nodejs.org/docs/latest-v10.x/api/index.html>
* <https://expressjs.com/en/api.html>
* <https://pugjs.org/>
* <https://node-postgres.com/> (<https://www.npmjs.com/package/pg>)
* <https://www.npmjs.com/package/debug>
* <https://www.npmjs.com/package/morgan>
* <https://www.npmjs.com/package/http-errors>
* <https://www.npmjs.com/package/jsonwebtoken>
* <https://jwt.io/>
