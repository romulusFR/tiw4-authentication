TIW4 2020-2021 "TP authentification" : documentation de déploiement
===================================================================

<!-- markdownlint-disable MD004-->
- [TIW4 2020-2021 "TP authentification" : documentation de déploiement](#tiw4-2020-2021-tp-authentification--documentation-de-déploiement)
  - [Installation générale](#installation-générale)
  - [Configuration nginx](#configuration-nginx)
  - [Configuration PostgreSQL](#configuration-postgresql)
  - [Mise en place de l'application Node.js](#mise-en-place-de-lapplication-nodejs)
    - [Configuration de la BD](#configuration-de-la-bd)
    - [Lancement en mode développement](#lancement-en-mode-développement)
    - [Lancement en mode production](#lancement-en-mode-production)
<!-- markdownlint-enable MD004-->

On donne ici des informations sur le déploiement de l'application _LOGON_ pour ceux qui souhaitent reproduire l'environnement en local.

Installation générale
---------------------

Le fichier [`configuration/install.sh`](configuration/install.sh) installe des versions à jour de Node.js, PostgresSQL et `nginx`.

Ensuite, on clone votre dépôt qui _forke_ le projet de départ <https://github.com/romulusFR/tiw4-authentication>.

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

- un certificat `snakeoil` pour TLS;
- le port 80 redirigé vers 443;
- une 502 sur car l'application Node.js n'est pas lancée.

Configuration PostgreSQL
------------------------

Création de l'utilisateur et de la base de données :

```bash
sudo -u postgres -s
createuser -D -e -P tiw4_auth
# pass :  tiw4_auth

createdb tiw4_auth -O tiw4_auth -e
psql -d tiw4_auth -c "create extension pgcrypto;"
exit
```

Ensuite, on peut se logguer _depuis localhost_ avec `PGPASSWORD=tiw4_auth psql -h localhost -U tiw4_auth -d tiw4_auth`.

Mise en place de l'application Node.js
--------------------------------------

### Configuration de la BD

Le script de création de la table et quelques comptes d'exemple est dans [`configuration/init.sql`](configuration/init.sql).
**Cette étape est déjà réalisée sur la VM fournie**.
On peut tester ensuite ainsi :

```sql
SELECT COUNT(*)
FROM users;
--  count
-- -------
--      4
-- (1 row)
```

### Lancement en mode développement

**C'est la seule chose à faire sur la VM qui vous est fournie.**

```bash
# on copie le fichier d'environnement
cp tiw4-authentication/app/DEV_ENVIRONMENT tiw4-authentication/app/.env

cd ~/tiw4-authentication/app
# on télécharge les node_modules
npm install
# si on veut lancer l'app en mode développement
npm run dev
```

A partir d'ici, l'application est lancée sur le port 3000 et on doit pouvoir y accéder sur le port 443.

### Lancement en mode production

On utilise ici le gestionnaire PM2 <https://pm2.keymetrics.io/docs/usage/quick-start/>

```bash
# installation globale du gestionnaire d'exécution node
npm install -g pm2@latest
# en mode production
pm2 start npm --name tiw4_auth --watch -- start
# pour monitorer l'application
pm2 monit
```
