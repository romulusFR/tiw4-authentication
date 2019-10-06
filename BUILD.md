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
-----------------------


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




Montage VM
----------

```bash
# ça n'a jamais fait de mal
sudo apt update
sudo apt upgrade

# on installe nginx
sudo add-apt-repository ppa:nginx/stable
sudo apt update
sudo apt-get install -y nginx nginx-doc

# puis node 10.x
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -  
sudo apt-get install -y nodejs  

# Manually change npm’s default directory
# https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

npm install pm2@latest -g


# et enfin postgres-11
sudo echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | sudo tee  /etc/apt/sources.list.d/pgdg.list > /dev/null
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt install postgresql-11

#le serveur est monté, on peut exécuté les script + haut en section Postgres



# on down l'app
git clone https://github.com/romulusFR/tiw4-authentication.git
cd tiw4-authentication/app
npm install

# ici on peut lancer l'app sur le port 3000 par défaut
pm2 start ./bin/www --name tiw4-auth

# on va configurer nginx en reverse proxy
cd 
/etc/nginx/sites-available
sudo mv default default.back

# puis créer les deux fichiers de configuration ci-dessous
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