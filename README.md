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

Un dossier `zip` est à rendre **au plus tard le dimanche 18/10/20 à 23h59** sur Tomuss.
Votre serveur **devra être en état de marche à cette date**, les accès réseaux vous seront révoqués.
Le  `zip` comprendra, voir le [modèle de base](MODELE_RENDU.zip) fourni :

* Un fichier README.md avec toutes les informations administratives
* Le rapport **d'au plus 1 page** de la partie A au format pdf **ET** en markdown.
* Le rapport **d'au plus 2 pages** de la partie B au format pdf **ET** en markdown.
* Les annexes de la partie A **d'au plus 4 pages**
* Les annexes de la partie B **d'au plus 8 pages**
* L'ensemble des sources de votre application modifiée

Aucun autre format que `.zip`, `.md` et `.pdf` ne sera accepté. Le contenu spécifique de chaque partie du rapport sera détaillé dans la partie afférente.

### Modalités d'évaluation

Les critères d'évaluation sont les suivants, ils seront appréciés sur la base des rapports des annexes **et** de tests sur votre serveur :

* [20%] Qualité des documents (clarté, organisation, langue, mise en page)
* [30%] Exhaustivité des mesures de sécurité
* [30%] Qualité technique des mesures proposée (configuration ou dévellopement selon le cas)
* [20%] Qualité de l'expérience utilisateur

Partie A : sécurisation système
--------------------------------

Sécurisez le serveur web qui vous est attribué.
Regardez en particulier la mise en place de HTTPS/TLS sur nginx.
Vous utiliserez *a minima* un certificat auto-signé généré avec OpenSSL et *de préférence* un certificat signé par l'autorité de certification nommé _TIW4-SSI-CAW Certificate Authority_ dont le matériel cryptographique est donné dans le dossier [./ca-tiw4](./ca-tiw4). Pour cela, vous générez un paire RSA, une demande CSR et un certificat signé de l'autorité pour **votre IP**. Voir quelques éléments sur OpenSSL et HTTPS/TLS dans [la partie 2 du nouveau TP1 MIF03-CAW](https://perso.liris.cnrs.fr/lionel.medini/enseignement/M1IF03/TP/TP_serveur.html).

Pour vous guider, consulter :

* Pour nginx
  - La doc Nginx <http://nginx.org/en/docs/http/configuring_https_servers.html> <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
  - Les tutoriels <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/> <https://www.linode.com/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/>
  - Cipherli.st Strong Ciphers for Apache, nginx and Lighttpd : <https://syslink.pl/cipherlist/>
* Pour OpenSSL
  - Setup complet de CA, avec autorité intermédiaire <https://jamielinux.com/docs/openssl-certificate-authority/>
  - Gestion des passwords dans openssl <https://stackoverflow.com/questions/4294689/how-to-generate-an-openssl-key-using-a-passphrase-from-the-command-line>
  - OpenSSL Command-Line HOWTO <https://www.madboa.com/geek/openssl/> ou <https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs>
* Pour les recommandations sur HTTPS/TLS
  - <https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-tls/>
  - <https://testssl.sh/> :  outil de référence poru tester votre configuration

Si la configuration du front nginx est au cœur du sujet, plus généralement, toutes les vulnérabilités  niveau système et leurs contre-mesures sont pertinentes, à l'exclusion de la bases de données PostgreSQL et du serveur d'application Node.js qui seront traités en partie B.

### Contenu du rapport partie A

La partie A du rapport sera composée comme suit :

* d'un tableau des mesures de sécurité mises en place, avec renvoi vers l'annexe. Le tableau constitue c'est l'essentiel du rapport. On donnera _pour chaque mesure_ identifiée :
  - une description du problème
  - la mesure proposée et la justification de son choix
  - un renvoi vers l'annexe pour les détails de la mesure technique et des de leurs justifications détaillée
* une conclusion sous la forme d'une évaluation de la sécurité vis-à-vis des bonnes pratiques de l'état de l'art
* les annexes : tous les scripts (config nginx, scripts bash des commandes OpenSSL) et références utiles à la description des mesures et leurs justifications.

**Vous devez toujours pouvoir garantir un accès aux enseignants *total* aux enseignants : documentez *toutes* vos modifications et assurez vous de l'exhaustivité des informations !**

Partie B : sécurisation applicative
-----------------------------------

Identifiez toutes les failles ou mauvaises pratiques de l'application web et prenez les mesures nécessaires pour sécuriser l'application et les comptes utilisateurs. Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données. Votre attention sur la sécurité applicative portera en particulier sur :

  1. le stockage des mots de passes dans PostgreSQL (choix du hash)
  2. le processus d'authentification et de son maintien _stateless_ (via JWT)
  3. le processus de création de compte (dureté du mot de passe, vérification de l'email, validité des saisies utilisateurs, mesures anti bots, limitations du nombre de tentatives)
  4. le processus de récupération du mot de passe (optionnel, via génération d'un token à validité limitée)
  5. la sécurité générale de l'application et les bonnes pratiques de développement NodeJS.
  6. la qualité de l'expérience utilisateur au delà de l'esthétique, c'est surtout les enchainements d'écrans et la clarté des retours/erreurs qui compte.

Pour vous guider, vous pouvez consulter :

* <https://jwt.io/> la référence sur JSON Web Token
* <https://cheatsheetseries.owasp.org/> recommandée, notamment les feuilles _Password Storage_ et _Authentication_.
* <https://github.com/goldbergyoni/nodebestpractices> recommandée, notamment  _6. Security Best Practices_
* <https://expressjs.com/en/guide/error-handling.html>
* <https://expressjs.com/en/advanced/best-practice-performance.html>
* <https://expressjs.com/en/advanced/best-practice-security.html>

**Remarque, si vous pouvez envoyer des emails via smtp.univ-lyon1.fr:25 avec par exemple [nodemailer](https://nodemailer.com/about/) il est _aussi_ demandé de _simuler_ leur envoi, par exemple en affichant le contenu du mail supposé envoyé dans une page web**.

### Contenu du rapport partie B

Similairement à la précédente, la partie B du rapport sera composée comme suit :

* d'un tableau des mesures de sécurité et nouvelles fonctionnalités mises en place, avec renvoi vers l'annexe. Le tableau constitue c'est l'essentiel du rapport. On donnera _pour chaque mesure_ identifiée :
  - une description du problème
  - la mesure proposée et la justification de son choix
  - un renvoi _précis_ (fichier et numéro de ligne) vers l'annexe pour les détails de la mesure technique et des de leurs justifications détaillée
* une conclusion sous la forme d'une évaluation de la sécurité vis-à-vis des bonnes pratiques de l'état de l'art
* les annexes : tous les extraits du code source, scripts et références utiles à la description des mesures ou fonctionnalités et de leurs justifications.

Vous veillerez en particulier à bien détailler les mesures/fonctionnalités relatives au point 1 à 4 cités plus haut (_stockage des mots de passes_, _processus d'authentification_, _création de compte_ et _récupération du mot de passe_).

L'ensemble du code **et** des scripts nécessaires au déploiement (notamment les scripts SQL) est fournie dans une autre annexe générale.
