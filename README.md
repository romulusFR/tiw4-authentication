tiw4-authentication
===================

Projet de départ pour le TP TIW4 de conception d'une application d'authentification.

On donne une application simple Node/Express avec un backend Postgres qui doit gérer des comptes utilisateurs, appellons cette application _LOGON_


Un serveur Ubuntu 18.04 est atrtibué à chaque binome dans Tomuss. L'application _LOGON_ est en place dans la VM.

Partie 0 : prise en main
--------------------------------

TBA


Partie A : sécurisation du front
--------------------------------

Sécurisez le serveur web qui vous est attribué. Regardez en particulier la mise en place de HTTPS/TLS sur nginx.
Vous utiliserez un certificat auto-signé ou celui fourni

Pour vous guider, consulter :
 
 - La doc Nginx <http://nginx.org/en/docs/http/configuring_https_servers.html> <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
 - <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/> <https://www.linode.com/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/>
 - OpenSSL Command-Line HOWTO <https://www.madboa.com/geek/openssl/>
 - les recommandations de l'ANSSI sur TLS : R3, R4, R5, R6, R7, R8, R9, R10 du document <https://www.ssi.gouv.fr/uploads/2016/09/guide_tls_v1.1.pdf>
 - <https://www.ssi.gouv.fr/uploads/IMG/pdf/NP_Linux_NoteTech_1_1.pdf>
 - <https://wiki.mozilla.org/Security/Server_Side_TLS>
 - <https://cipherli.st/>

Si la configuration du front nginx est au coeur du sujet, plus généralement, toutes les vulnérabilités et leurs contre-mesures sont pertinentes, notamment celles niveau système ou bases de donnée.

### Rapport

Le rapport est attendu au format pdf généré à partir d'une source markdown. Le pdf **et** les sources sont à rendre.
Le rapport pour cette partie sera **d'au plus 2 pages avec au plus 8 pages d'annexe**. Il sera composé :

 * d'un tableau des mesures de sécurité mises en place, avec renvoi vers l'annexe, c'est l'essentiel du rapport. On donnera pour chaque problème de sécurité identifié
    * une très courte description du problème
    * la mesure proposée
    * un renvoi vers l'annexe pour le détails de la mesure technique
 * une conclusion sous la forme d'une évaluation de la sécurité viz à viz des bonnes pratiques de l'état de l'art avec notamment des outils comme <https://testssl.sh/>.
 * les annexes : tous les scripts (config nginx, scripts bash des commandes openssl) et références utiles


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
 * <https://expressjs.com/en/advanced/best-practice-security.html>
 * <https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices>
 * <https://www.npmjs.com/package/cors>

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
 


