TP TIW4 2019-2020 : sécurisation d'une application d'authentification
=====================================================================

Introduction
------------

On donne une application d'authentification simple Node/Express avec un backend Postgres qui doit gérer des comptes utilisateurs, appellons cette application _LOGON_. Le projet de départ vous est fourni ainsi qu'un serveur Ubuntu 18.04 (un atrtibué à chaque binome dans Tomuss) avec l'application _LOGON_ est en place dans la VM. Sur un malentendu le serveur de développement est devenu le serveur de production : on vous confie la patate chaude de sécuriser _LOGON_.

Le TP consiste ainsi à sécuriser le serveur et l'application. Il est composé de deux parties :

* **[partie A](#Partie-A-:-sécurisation-du-front)** on s'intéresse au système et en particulier aux front Nginx
* **[partie B](#Partie-B-:-sécurisation-applicative)** on s'intéresse à l'applicatif : le serveur d'application, la base de données et surtout l'application elle même.

Le fichier [`BUILD.md`](./BUILD.md) donne des informations techniques sur le développement de l'application qui vous seront utilie pour déployer en local dans la partie B. **Il est important de commencer ce TP par sa lecture**.


### Modalités de rendu

Un dossier `zip` est à rendre **au plus tard le dimanche 20/10/19 à 23h59** dans la case idoine de Tomuss. Votre serveur **devra être en état de marche à cette date**. Le dossier  `zip` comprendra, voir le [modèle de base](MODELE_RENDU.zip) fourni :

* Un fichier README.md avec toutes les informations administratives
* Le rapport **d'au plus 2 pages avec au plus 8 pages d'annexe** de la partie A au format pdf **ET** en markdown.
* Le rapport **d'au plus 2 pages avec au plus 8 pages d'annexe** de la partie B au format pdf **ET** en markdown.
* Les annexes aux parties A et B
* La source de votre application modifiée

Aucun autre format que `.zip`, `.md` et `.pdf` ne sera accepté. Le contenu spécifique de chaque partie du rapport sera détaillé dans la partie afférante.

### Modalités d'évaluation

Les critères d'évaluation sont les suivants, ils seront appréciés sur la base des rapports des annexes **et** de tests sur votre serveur :

* [20%] Qualité des documents (clarté, organisation, langue, mise en page)
* [30%] Exhaustivité des mesures de sécurité
* [30%] Qualité technique des mesures proposée (configuration ou dévellopement selon le cas)
* [20%] Qualité de l'expérience utilisateur sur la démonstration


Partie A : sécurisation du front
--------------------------------

Sécurisez le serveur web qui vous est attribué. Regardez en particulier la mise en place de HTTPS/TLS sur nginx. Vous utiliserez un certificat auto-signé. TBD

Pour vous guider, consulter :
 
 - La doc Nginx <http://nginx.org/en/docs/http/configuring_https_servers.html> <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
 - Les tutoriels <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/> <https://www.linode.com/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/>
 - OpenSSL Command-Line HOWTO <https://www.madboa.com/geek/openssl/>
 - les recommandations de l'ANSSI sur TLS : R3, R4, R5, R6, R7, R8, R9, R10 du document <https://www.ssi.gouv.fr/uploads/2016/09/guide_tls_v1.1.pdf>
  - <https://wiki.mozilla.org/Security/Server_Side_TLS>

Si la configuration du front nginx est au coeur du sujet, plus généralement, toutes les vulnérabilités et leurs contre-mesures sont pertinentes, notamment celles niveau système (mais pas de la bases de données postgres ou du serveur d'application node qui serons traités en partie B).

### Rapport

La partie A du rapport sera composée :

 * d'un tableau des mesures de sécurité mises en place, avec renvoi vers l'annexe, c'est l'essentiel du rapport. On donnera pour chaque problème de sécurité identifié
    * une très courte description du problème
    * la mesure proposée
    * un renvoi vers l'annexe pour le détails de la mesure technique
 * une conclusion sous la forme d'une évaluation de la sécurité viz à viz des bonnes pratiques de l'état de l'art avec notamment des outils comme <https://testssl.sh/> ou <https://cipherli.st/>
 * les annexes : tous les scripts (config nginx, scripts bash des commandes openssl) et références utiles

**Vous devez toujours pouvoir garantir un accès aux enseignants *total* aux l'enseignants : documentez *toutes* vos modification !**


Partie B : sécurisation applicative
-----------------------------------

Votre attention sur la sécurité applicative portera particulièrement sur :

    * le stockage des mots de passes en base
    * le processus de création de compte
    * l'accès à la base de données (API, compte)
    * le processus de récupération du mot de passe


Identifiez toutes les failles ou mauvaises pratiques de l'application web et prenez les mesures nécessaires pour sécuriser l'application et les comptes utilisateurs. Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données.

Pour vous guider, consulter

 *  <https://cheatsheetseries.owasp.org/>, notamment Password Storage et Authentication.
 * <https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices>


Remarque

Pas de serveur mail, donc afficher le contenu d'un email et simuler l'usr qui valide

### Rapport


TBA

Le rapport comprendra les sections suivantes :
    
 1. Le stockage des mots de passes
    Vous corrigerez les failles ou mauvaises pratiques identifiées sur le stockage
    des mots de passes et motiverez les choix techniques de votre correction.
    Vous décrirez également la migration des comptes existants dans votre nouvelle
    solution.
 2. Le processus de création de compte

      Vous détaillerez les différentes étapes du processus de création de compte

      en justifiant de leurs pertinences du point de vue de la sécurité

 3. L'accès à la base de données
    Vous justifierez de votre solution pour protéger les accès à la BD.
 4. Récupération des mots de passes (SI APPLICABLE)
    Vous détaillerez les différentes étapes du processus de récupération de mot
    de passe en justifiant de leurs pertinences du point de vue de la sécurité
 5. Conclusion
    Courte synthèse sur les étapes précédentes sous la forme de recommandations
    et de références à approfondir.
 6. Annexes : scripts php et sql
    Vous donnerez les scripts (php, sql, ...) complets de votre solution.
 7. Annexes : références web
 


