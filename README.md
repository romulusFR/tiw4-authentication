TIW4 2020-2021 "TP authentification" : sécurisation d'une application d'authentification
========================================================================================

Introduction
------------

On donne une [application d'authentification simple Node.js/Express](https://github.com/romulusFR/tiw4-authentication) avec un backend PostgreSQL qui doit gérer des comptes utilisateurs, appelons cette application _LOGON_.
Le TP consiste en la sécurisation du serveur et de l'application _LOGON_, il est ainsi composé de deux parties principales :

* **Sécurisation-système** on s'intéresse au niveau système (Linux, serveur `nginx`, serveur PostgreSQL) et la mise en place de TLS;
* **Sécurisation-applicative** on s'intéresse au serveur d'application Node.js et l'application elle même.

### Modalités de rendu et d'évaluation

La date limite d'exécution est **le dimanche 18/10/20 à 23h59**.
A cette date, vous devrez :

* avoir mis l'URL de votre dépôt sur Tomuss;
* avoir complété le fichier [`RAPPORT.md`](RAPPORT.md);
* avoir votre serveur **en état de marche** pour les tests automatisés.

**Important** : à échéance, tous les dépôts GitLab seront clonés et l'accès aux VMs supprimé.

L'évaluation portera sur :

* la qualité technique et rédactionnelle du rapport;
* l'exhaustivité des mesures identifiées et éventuellement implantées;
* la valeur ajoutée du rapport (appprofondissenements, idées nouvelles ou complémentaires);
* les tests automatisés de la configuration système;
* une évaluation manuelle de l'application exécutée sur le serveur.

**Attention** : remarques importantes sur le rendu, tout manquement sera sévèrement sanctionné :

* donnez moi les droits `Reporter` sur votre dépôt;
* il est _absolument interdit_ d'utiliser _un dépôt public_;
* votre dépôt ne doit _en aucun cas_ contenir des éléments inutiles ou volumineux;
* il faut pouvoir garantir un accès pour la correction :
  - _rate limiting_;
  - révocation des droits _sudoers_ de l'utilisateur _ubuntu_;
  - suppression de la clef `TIW4-VM-authentif.pem` de `~/.ssh/authorized_keys`.

Certaines mesures sont donc **interdites** à mettre en place, mais vous êtes invités à les tester et à les mettre dans le rapport dans l'état _à faire_.

### Changelog

* 2020-10-03 : restructuration sujet et rendu
* 2020-10-02 : remplacement de <https://pugjs.org> par <https://ejs.co/>
* 2020-10-01 : mise à jour générale

Partie A : mise en place
------------------------

Un serveur Ubuntu 20.04 est fourni à chaque binôme. Son IP est donnée dans Tomuss. La VM a également un nom DNS de la forme `tiw4-authentication-XX.tiw4.os.univ-lyon1.fr` où `XX` est votre numéro de binôme sur un ou deux chiffres (e.g., 1, 2, ..., 10, 11).
Les secrets la clef `TIW4-VM-authentif.pem` d'accès à la VM et la _passphrase_ de la CA vous sont communiqués sur le Discord.

Le fichier [`DEPLOY.md`](./DEPLOY.md) donne des informations sur le déploiement de l'application, sauf la toute fin du document, ce sont les étapes qui ont _déjà été faites_ sur la VM qui vous est fournie.

Une VM de référence avec l'application de départ déployée est accessible à <https://tiw4-authentication-gold.tiw4.os.univ-lyon1.fr/> (IP : 192.168.74.142)

### Travail à faire

* Lisez l'intégralité du sujet familiarisez vous avec l'environnement et l'application **avant** la séance.
* Créez un dépôt **privé** sur <https://forge.univ-lyon1.fr> et _forkez_ le projet de départ GitHub [en y ajoutant un nouveau _remote_](https://stackoverflow.com/questions/50973048/forking-git-repository-from-github-to-gitlab).
* Connectez vous sur la VM et lancez l'application.
* Corrigez le problème de la redirection `nginx` dans la configuration initiale

### Questions

Les questions de ce document, sont là pour vous guider, vous aider à comprendre le fonctionnement et à identifier des problèmes de sécurité.



Partie B : sécurisation système
--------------------------------

Il s'agit de sécuriser le serveur qui vous est attribué et de mettre en place de HTTPS/TLS sur `nginx`.
Pour cela, nous fournissons le matériel cryptographique de l'autorité de certification nommée _tiw4-ca_ ainsi que des configurations OpenSSL dans le dossier [./tiw4-ca](./tiw4-ca). Le fichier [`tiw4-ca/README.md`](tiw4-ca/README.md) détaille la marche à suivre (tirage de clef, génération CSR, génération certificat).

Si la configuration du front `nginx` est au cœur du sujet, plus généralement, toutes les vulnérabilités niveau système et leurs contre-mesures sont pertinentes, virtuellement tout ce qui ne relève pas du code de l'application _LOGON_ :

* création d'utilisateurs Linux, leurs droits:
* firewall, fail2ban;
* paramétrage  du _rate limiter_ dans `nginx` (peut aussi être fait via express);
* configuration du serveur PostgreSQL et de la base `tiw4_auth`.


### Questions


- pourquoi dit-on que `tiw4-ca` est une autorité _intermédiaire_ ?
- quel est le CN de l’émetteur du certificat (_issuer_) dans `tiw4-ca.cert` ?
- quel est le CN du sujet certifié (_subject_) dans `tiw4-ca.cert`?
- dans la configuration initiale de la VM fournie, qui sont l’émetteur et le sujet du certificat utilisé ?
- avec la configuration OpenSSL fournie, peut-on utiliser le certificat que vous allez générer pour en signer d'autres ? Pourquoi ?
- que se passe-t'il si vous utilisez un autre _organizationName_ pour votre serveur ?
- pourquoi demander pour le serveur une clef RSA 2048 bits et pas 1024 ou 4096 ?
- après génération d'un certificat, que contient le fichier `index` ?
- quelle est la durée maximum que vous pouvez raisonnablement donner au certificat que vous allez générer pour votre VM ?



Partie C : sécurisation applicative
-----------------------------------

Identifiez toutes les failles ou mauvaises pratiques de l'application web et prenez les mesures nécessaires pour sécuriser l'application et les comptes utilisateurs. Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données. Votre attention sur la sécurité applicative portera en particulier sur :

* le stockage des mots de passes dans PostgreSQL (choix du hash)
* le processus de création de compte (dureté du mot de passe, vérification de l'email, validité des saisies utilisateurs, mesures anti bots, limitations du nombre de tentatives)
* le processus de récupération du mot de passe (optionnel, via génération d'un token à validité limitée)
* la sécurité générale de l'application et les bonnes pratiques de développement NodeJS.
* la qualité de l'expérience utilisateur au delà de l'esthétique, c'est surtout les enchainements d'écrans et la clarté des retours/erreurs qui compte.

**Remarque**, si vous pouvez envoyer des emails via smtp.univ-lyon1.fr:25 avec par exemple [nodemailer](https://nodemailer.com/about/) il est _aussi_ demandé de _simuler_ leur envoi, par exemple en affichant le contenu du mail supposé envoyé dans une page web.

Conseils généraux
-----------------

* _Prenez des notes_ tout au long de vos interventions et complétez le rapport demandé au fur et à mesure.
* Votre travail doit être **reproductible** : votre dépôt doit donc _impérativement_ contenir **toutes** les configurations modifiées, les scripts etc.
* Soyez _clairs, concis et rigoureux_ dans vos rapport et votre développement, je veux **de la qualité** :
  - des sources d'autorité qui justifient les choix;
  - du code et des scripts _parfaitement clean_ : `prettier`, `eslint`, `markdownlint`;
  - commentaires _obligatoires_.
* Pensez à vous mettre en _navigation privée_ pour vos tests, en particulier quand vous modifiez et testez la configuration `nginx`.
* Utilisez un _multiplexeur de terminal_ comme [`screen`](https://www.gnu.org/software/screen/screen.html), [`tmux`](https://github.com/tmux/tmux/wiki) ou [`byobu`](https://www.byobu.org/) (le choix de l'auteur) :
  - permet de détacher les processus qui continueront à s'exécuter après déconnexion;
  - permet de retrouver l'état de ses terminaux après reconnexion;
  - permet de partager le terminal entre plusieurs utilisateurs (tout le monde voit la même chose);
  - permet d'avoir plusieurs terminaux dans une même fenêtre et une seule connexion SSH.
* _Configurez votre environnement de travail_ pour être productifs :
  - l'IDE (VSCode/Codium pour moi);
  - `.ssh/config` et clefs sur votre dépôt GitLab;
  - la config de `psql`, e.g., [voir ici](https://forge.univ-lyon1.fr/bd-pedago/bd-pedago#ligne-de-commande-psql);
  - scripts bash pour automatiser le déploiement (optionnel).

Références
----------

### Configuration HTTPS/TLS

* La documentation `nginx` et tutoriels
  - <http://nginx.org/en/docs/http/configuring_https_servers.html>
  - <http://nginx.org/en/docs/http/ngx_http_ssl_module.html>
  - <https://www.linode.com/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/>
  - <https://www.linode.com/docs/*eb-servers/nginx/tls-deployment-best-practices-for-nginx/>
* Configuration TLS
  - <https://syslink.pl/cipherlist/> : strong ciphers for Apache, nginx and Lighttpd
  - <https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-tls/> : recommandations de l'ANSSI
  - <https://testssl.sh/> : outil pour tester votre configuration
* <https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html> mise en place de la CA avec OpenSSL (suivi par l'auteur)

### Sécurité Node.js et bonnes pratiques de production

* <https://cheatsheetseries.owasp.org/> recommandée, notamment les feuilles _Password Storage_ et _Authentication_.
* <https://github.com/goldbergyoni/nodebestpractices> recommandée, notamment  _6. Security Best Practices_
* <https://expressjs.com/en/guide/error-handling.html>
* <https://expressjs.com/en/advanced/best-practice-performance.html>
* <https://expressjs.com/en/advanced/best-practice-security.html>

### Développement Node.js

* <https://ejs.co/>
* <https://nodejs.org/dist/latest-v14.x/docs/api/>
* <https://expressjs.com/en/api.html>
* <https://node-postgres.com/> (<https://www.npmjs.com/package/pg>)
* <https://www.npmjs.com/package/debug>
* <https://www.npmjs.com/package/morgan>
* <https://www.npmjs.com/package/http-errors>
* <https://www.npmjs.com/package/jsonwebtoken>
* <https://jwt.io/>
