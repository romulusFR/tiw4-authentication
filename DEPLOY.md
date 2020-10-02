TIW4 2020-2021 "TP authentification" : documentation de déploiement
===================================================================

<!-- markdownlint-disable MD004-->
- [TIW4 2020-2021 "TP authentification" : documentation de déploiement](#tiw4-2020-2021-tp-authentification--documentation-de-déploiement)
  - [Installation générale](#installation-générale)
  - [Configuration nginx](#configuration-nginx)
  - [Configuration PostgreSQL](#configuration-postgresql)
  - [Lancement de l'application Node.js](#lancement-de-lapplication-nodejs)
<!-- markdownlint-enable MD004-->

On donne ici des informations sur le déploiement de l'application _LOGON_ pour ceux qui souhaitent reproduire l'environnement en local.

Installation générale
---------------------

Pour des versions à jour de Node.js, PostgresSQL et `nginx`, voir le fichier [`configuration/install.sh`](configuration/install.sh).

Ensuite, on clone le dépôt avec `git clone https://github.com/romulusFR/tiw4-authentication.git`.

Configuration nginx
-------------------

On va configurer nginx en _reverse proxy_ avec les trois fichiers de configuration du dossier `configuration/` ci-dessous :

- Fichier [`/etc/nginx/snippets/proxy_set_header.conf`](configuration/proxy_set_header.conf);
- Fichier [`/etc/nginx/snippets/ssl_params.conf`](configuration/ssl_params.conf);
- Fichier [`/etc/nginx/sites-available/default`](configuration/default).

```bash
# on backup avant remplacement
cd /etc/nginx/sites-available/
sudo mv default default.back
```

A ce stade on a :

- un certificat auto-signé `snakeoil`;
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

Le script de création de la table et quelques comptes d'exemple est dans [`configuration/init.sql`](configuration/init.sql).
On peut tester ensuite ainsi :

```sql
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
# on copie le fichier d'environnement
cp tiw4-authentication/app/DEV_ENVIRONMENT tiw4-authentication/app/.env

cd ~/tiw4-authentication/app
# on télécharge les node_modules
npm install
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
