TP TIW4 2019-2020 "authentification" : sécurisation d'une application (éducative) d'authentification
=====================================================================================================

Introduction
------------

On donne une [application d'authentification simple Node.js/Express](https://github.com/romulusFR/tiw4-authentication) avec un backend PostgreSQL qui doit gérer des comptes utilisateurs, appelons cette application _LOGON_.
Le projet de départ vous est fourni ainsi qu'un serveur Ubuntu 18.04 (un attribué à chaque binôme dans Tomuss) avec l'application _LOGON_ déployée.
L'application n'est en revanche **pas** lancée.

Sur un malentendu cette VM de développement est devenu un serveur de production : on vous confie la patate chaude de sécuriser le serveur et son application _LOGON_.
Le TP consiste ainsi à sécuriser le serveur et l'application. Il est composé de deux parties :

* **[partie A](#Partie-A-:-sécurisation-du-front)** on s'intéresse au système et en particulier aux front nginx;
* **[partie B](#Partie-B-:-sécurisation-applicative)** on s'intéresse à l'applicatif : le serveur d'application Node.js, la base de données PostgreSQL et surtout l'application elle même.

Le fichier [`BUILD.md`](./BUILD.md) donne des informations techniques sur le développement de l'application qui vous seront utiles pour déployer en local pour le développement en la partie B. **Il est important de commencer ce TP en se familiarisant avec l'application**.


### Modalités de rendu

Un dossier `zip` est à rendre **au plus tard le dimanche 20/10/19 à 23h59** dans la case idoine de Tomuss.
Votre serveur **devra être en état de marche à cette date**.
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
* [20%] Qualité de l'expérience utilisateur sur la démonstration


Partie A : sécurisation du front
--------------------------------

Sécurisez le serveur web qui vous est attribué.
Regardez en particulier la mise en place de HTTPS/TLS sur nginx.
Vous utiliserez un certificat auto-signé généré avec OpenSSL.

Pour vous guider, consulter :
 
 - La doc Nginx <http://nginx.org/en/docs/http/configuring_https_servers.html> <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
 - Les tutoriels <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/> <https://www.linode.com/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/>
 - OpenSSL Command-Line HOWTO <https://www.madboa.com/geek/openssl/>
 - les recommandations de l'ANSSI sur TLS : R3, R4, R5, R6, R7, R8, R9, R10 du document <https://www.ssi.gouv.fr/uploads/2016/09/guide_tls_v1.1.pdf>
  - <https://wiki.mozilla.org/Security/Server_Side_TLS>

Si la configuration du front nginx est au cœur du sujet, plus généralement, toutes les vulnérabilités  niveau système et leurs contre-mesures sont pertinentes, à l'exclusion de la bases de données PostgreSQL et du serveur d'application Node.js qui seront traités en partie B.

### Rapport

La partie A du rapport sera composée comme suit :

 * d'un tableau des mesures de sécurité mises en place, avec renvoi vers l'annexe. Le tableau constitue c'est l'essentiel du rapport. On donnera _pour chaque mesure_ identifiée :
    * une description du problème
    * la mesure proposée et la justification de son choix
    * un renvoi vers l'annexe pour les détails de la mesure technique et des de leurs justifications détaillée
 * une conclusion sous la forme d'une évaluation de la sécurité vis-à-vis des bonnes pratiques de l'état de l'art avec notamment des outils comme <https://testssl.sh/> ou <https://cipherli.st/>
 * les annexes : tous les scripts (config nginx, scripts bash des commandes OpenSSL) et références utiles à la description des mesures et leurs justifications.

**Vous devez toujours pouvoir garantir un accès aux enseignants *total* aux enseignants : documentez *toutes* vos modifications et assurez vous de l'exhaustivité des informations !**


Partie B : sécurisation applicative
-----------------------------------

Identifiez toutes les failles ou mauvaises pratiques de l'application web et prenez les mesures nécessaires pour sécuriser l'application et les comptes utilisateurs. Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données. Votre attention sur la sécurité applicative portera en particulier sur :

  1. le stockage des mots de passes dans PostgreSQL
  2. le processus d'authentification et de son maintien _stateless_
  3. le processus de création de compte
  4. le processus de récupération du mot de passe (optionnel)
  5. la sécurité générale de l'application NodeJS
  6. la qualité de l'expérience utilisateur au delà de l'esthétique, c'est surtout les enchainements d'écrans et la clarté des retours/erreurs qui compte.


Pour vous guider, vous pouvez consulter :

* <https://cheatsheetseries.owasp.org/> recommandée, notamment les feuilles _Password Storage_ et _Authentication_.
* <https://github.com/goldbergyoni/nodebestpractices> recommandée, notamment  _6. Security Best Practices_
* <https://expressjs.com/en/guide/error-handling.html>
* <https://expressjs.com/en/advanced/best-practice-performance.html>
* <https://expressjs.com/en/advanced/best-practice-security.html>


**Remarque, si vous pouvez envoyer des emails  via smtp.univ-lyon1.fr il est _aussi_ demandé de _simuler_ leur envoi, par exemple en affichant le contenu du mail supposé envoyé dans une page web**.

### Rapport

Similairement à la précédente, la partie B du rapport sera composée comme suit :


 * d'un tableau des mesures de sécurité et nouvelles fonctionnalités mises en place, avec renvoi vers l'annexe. Le tableau constitue c'est l'essentiel du rapport. On donnera _pour chaque mesure_ identifiée :
    * une description du problème
    * la mesure proposée et la justification de son choix
    * un renvoi _précis_ (fichier et numéro de ligne) vers l'annexe pour les détails de la mesure technique et des de leurs justifications détaillée
 * une conclusion sous la forme d'une évaluation de la sécurité vis-à-vis des bonnes pratiques de l'état de l'art
* les annexes : tous les extraits du code source, scripts et références utiles à la description des mesures ou fonctionnalités et de leurs justifications.

Vous veillerez en particulier à bien détailler les mesures/fonctionnalités relatives au point 1 à 4 cités plus haut (_stockage des mots de passes_, _processus d'authentification_, _création de compte_ et _récupération du mot de passe_).

L'ensemble du code **et** des scripts nécessaires au déploiement (notamment les scripts SQL) est fournie dans une autre annexe générale.
