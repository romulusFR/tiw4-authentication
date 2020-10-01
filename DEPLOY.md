TIW4 2020-2021 "TP authentification" : documentation de déploiement
===================================================================

<!-- markdownlint-disable MD004-->
- [TIW4 2020-2021 "TP authentification" : documentation de déploiement](#tiw4-2020-2021-tp-authentification--documentation-de-déploiement)
  - [Installation générale](#installation-générale)
  - [Configuration nginx](#configuration-nginx)
    - [Fichier `/etc/nginx/snippets/proxy_set_header.conf`](#fichier-etcnginxsnippetsproxy_set_headerconf)
    - [Fichier `/etc/nginx/snippets/ssl_params.conf`](#fichier-etcnginxsnippetsssl_paramsconf)
    - [Fichier `/etc/nginx/sites-available/default`](#fichier-etcnginxsites-availabledefault)
  - [Configuration PostgreSQL](#configuration-postgresql)
  - [Lancement de l'application Node.js](#lancement-de-lapplication-nodejs)
<!-- markdownlint-enable MD004-->

On donne ici des informations sur le déploiement de l'application _LOGON_ pour ceux qui souhaitent reproduire l'environnement en local.

Installation générale
---------------------

Pour des versions à jour de Node.js, PostgresSQL et nginx.

```bash
# update générale
sudo apt update
sudo apt upgrade

# installation nginx
sudo apt-get install -y nginx ssl-cert

# test
sudo nginx -v
#nginx version: nginx/1.18.0 (Ubuntu)

# installation node 14.x
# https://github.com/nodesource/distributions#debinstall
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs

# puis suivre https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

# test
node -v
# v14.13.0
npm -v
# 6.14.8


#  installation postgres-13
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-13

# test
sudo -u postgres psql -c "SELECT version();"
#                                                           version
# ----------------------------------------------------------------------------------------------------------------------------
#  PostgreSQL 13.0 (Ubuntu 13.0-1.pgdg20.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-10ubuntu2) 9.3.0, 64-bit

```

Configuration nginx
-------------------

On va configurer nginx en _reverse proxy_ avec les configurations ci-dessous :

```bash
cd /etc/nginx/sites-available/
sudo mv default default.back
```

### Fichier `/etc/nginx/snippets/proxy_set_header.conf`

```nginx
proxy_set_header X-Forwarded-By $server_addr:$server_port;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host $host;
```

### Fichier `/etc/nginx/snippets/ssl_params.conf`

```nginx
# configuration à durcir
ssl_prefer_server_ciphers on;
```

### Fichier `/etc/nginx/sites-available/default`

```nginx
upstream nodejs {
    zone nodejs 64k;
    server localhost:3000;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2 ipv6only=on;

    include snippets/snakeoil.conf;
    include snippets/ssl_params.conf;

    location / {
       include /etc/nginx/snippets/proxy_set_header.conf;
       proxy_pass http://nodejs;
    }
}

server {
    listen 80;
    listen [::]:80;
    location / {
         return 308 https://192.168.74.142/$request_uri;
    }
}
```

A ce stade on a :

- un certificat auto-signé;
- le port 80 redirigé vers 443;
- une 502 sur car l'application Node.js n'est pas lancée.

Configuration PostgreSQL
------------------------

Montage du serveur

```bash
sudo -u postgres -s
createuser -D -e -P tiw4_auth
# pass :  tiw4_auth

createdb tiw4_auth -O tiw4_auth -e
psql -d tiw4_auth -c "create extension pgcrypto;"
exit
```

Ensuite, pour se logguer avec `PGPASSWORD=tiw4_auth psql -h localhost -U tiw4_auth -d tiw4_auth`.

Ci-après, le script de création de la table et quelques comptes d'exemple.

```sql
CREATE SCHEMA IF NOT EXISTS tiw4_auth;
DROP TABLE IF EXISTS tiw4_auth.users;

CREATE TABLE IF NOT EXISTS tiw4_auth.users (
  userid INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password VARCHAR(8) NOT NULL
);

INSERT INTO users(username, email, password) VALUES ('superadmin','mevin.kitnick@hotmail.com','iloveu');
INSERT INTO users(username, email, password) VALUES ('sandygeorge','sandy.george@hotmail.com','zuley03');
INSERT INTO users(username, email, password) VALUES ('griffonpress','griffonpress@gmail.com','Skylar7');
INSERT INTO users(username, email, password) VALUES ('politis','politis@hotmail.com','derby5');

SELECT COUNT(*)
FROM users;
--  count
-- -------
--      4
-- (1 row)
```

Lancement de l'application Node.js
----------------------------------

```bash
# on clone le repo
git clone https://github.com/romulusFR/tiw4-authentication.git
# on copie le fichier d'environnement
cp tiw4-authentication/app/DEV_ENVIRONMENT tiw4-authentication/app/.env

cd ~/tiw4-authentication/app
# si on veut lancer l'app en mode développement
npm run dev
# là on doit pouvoir accéder à la VM sur le port 443 sans erreur et voir une page
```

A partir d'ici, on ici on peut lancer l'app sur le port 3000 par défaut.
**C'est la seule chose à faire sur la VM qui vous est fournie.**

```bash
cd ~/tiw4-authentication/app
# si on veut lancer l'app en mode développement
npm run dev

# installation globale du gestionnaire d'exécution node
npm install -g pm2@latest
# en mode production
pm2 start ./bin/www --name tiw4-auth
pm2 monit
```
