TIW4 2020-2021 "TP authentification" : sécurisation d'une application d'authentification
========================================================================================

Introduction
------------

On donne une [application d'authentification simple Node.js/Express](https://github.com/romulusFR/tiw4-authentication) avec un backend PostgreSQL qui doit gérer des comptes utilisateurs, appelons cette application _LOGON_.
Le TP consiste en la sécurisation du serveur et de l'application _LOGON_, il est ainsi  composé de deux parties :

* **[partie A](#Partie-A-:-sécurisation-système)** on s'intéresse au niveau système (Linux, serveur _nginx_, serveur PostgreSQL) dont la mise en place de TLS;
* **[partie B](#Partie-B-:-sécurisation-applicative)** on s'intéresse au serveur d'application Node.js, à la base de données hébergée dans PostgreSQL et l'application elle même.

Le fichier [`BUILD.md`](./BUILD.md) donne des informations utiles sur le déploiement et le développement.
Un serveur Ubuntu 20.04 vous sera fourni pour vos tests, il devra être _up and running_ pour l'évaluation.

**Il est important de commencer ce TP en se familiarisant avec l'environnement et l'application**.

### Remarques

* l'application _LOGON_ n'est **pas** lancée, voir la section [`BUILD.md`](./BUILD.md)
* l'IP de la VM attribuée à chaque binôme sera dans Tomuss
* les secrets (le `.pem` d'accès à la VM et la _passphrase_ de la CA) vous sont communiqués sur le Discord

### Modalités de rendu

La structure du rapport à suivre est fournie dans le dossier [`rendu/`](rendu/).
La date limite d'exécution est **le dimanche 18/10/20 à 23h59**.
A cette date, vous devrez :

* avoir mis l'URL de votre dépôt sur Tomuss
  - **Attention** : donnez moi les droits `Reporter`
* avoir complété les rapports du dossier `rendu` dans votre dépôt
* avoir votre serveur **en état de marche**

A la date donnée, je clonerai tous les dépôts et je bloquerai l'accès aux VMs.

### Modalités d'évaluation

Poids indicatifs susceptibles de modification

* [30%] Rapport partie A
* [30%] Rapport partie B
* [40%] Tests sur la VM

Partie A : sécurisation système
--------------------------------

Il s'agit de sécuriser le serveur web qui vous est attribué et de mettre en place de HTTPS/TLS sur `nginx`.
Pour cela, nous fournissons le matériel cryptographique de l'autorité de certification nommée _tiw4-ca_ ainsi que des configurations OpenSSL dans le dossier [./tiw4-ca](./tiw4-ca). Le fichier [`tiw4-ca/README.md`](tiw4-ca/README.md) détaille a marche à suivre (tirage de clef, génération CSR, génération certificat).

Si la configuration du front `nginx` est au cœur du sujet, plus généralement, toutes les vulnérabilités  niveau système et leurs contre-mesures sont pertinentes, à l'exclusion de la bases de données PostgreSQL et du serveur d'application Node.js qui seront traités en partie B.

Partie B : sécurisation applicative
-----------------------------------

Identifiez toutes les failles ou mauvaises pratiques de l'application web et prenez les mesures nécessaires pour sécuriser l'application et les comptes utilisateurs. Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données. Votre attention sur la sécurité applicative portera en particulier sur :

  1. le stockage des mots de passes dans PostgreSQL (choix du hash)
  2. le processus d'authentification et de son maintien _stateless_ (via JWT)
  3. le processus de création de compte (dureté du mot de passe, vérification de l'email, validité des saisies utilisateurs, mesures anti bots, limitations du nombre de tentatives)
  4. le processus de récupération du mot de passe (optionnel, via génération d'un token à validité limitée)
  5. la sécurité générale de l'application et les bonnes pratiques de développement NodeJS.
  6. la qualité de l'expérience utilisateur au delà de l'esthétique, c'est surtout les enchainements d'écrans et la clarté des retours/erreurs qui compte.

**Remarque, si vous pouvez envoyer des emails via smtp.univ-lyon1.fr:25 avec par exemple [nodemailer](https://nodemailer.com/about/) il est _aussi_ demandé de _simuler_ leur envoi, par exemple en affichant le contenu du mail supposé envoyé dans une page web**.

Références
----------

Configuration HTTPS/TLS :

* La documentation `nginx` <http://nginx.org/en/docs/http/configuring_https_servers.html> <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
* Les tutoriels <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/> <https://www.linode.com/docs/*eb-servers/nginx/tls-deployment-best-practices-for-nginx/>
* Cipherli.st Strong Ciphers for Apache, nginx and Lighttpd : <https://syslink.pl/cipherlist/>
* Les recommandations de l'ANSSI <https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-tls/>
* L'outil de référence pour tester votre configuration <https://testssl.sh/>
* Le tutoriel suivi par l'auteur pour la mise en place de la CA dans ce TP et en M1IF03 <https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html>

Programmation Node.js :

* <https://jwt.io/> la référence sur JSON Web Token
* <https://cheatsheetseries.owasp.org/> recommandée, notamment les feuilles _Password Storage_ et _Authentication_.
* <https://github.com/goldbergyoni/nodebestpractices> recommandée, notamment  _6. Security Best Practices_
* <https://expressjs.com/en/guide/error-handling.html>
* <https://expressjs.com/en/advanced/best-practice-performance.html>
* <https://expressjs.com/en/advanced/best-practice-security.html>
