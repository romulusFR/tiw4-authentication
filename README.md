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
* avoir votre serveur **en état de marche en production** pour les tests automatisés.

**Important** : à échéance, tous les dépôts GitLab seront clonés et l'accès aux VMs supprimé.

L'évaluation portera sur :

* la qualité technique et rédactionnelle du rapport;
* l'exhaustivité des mesures identifiées et éventuellement implantées;
* la valeur ajoutée du rapport (approfondissements, idées nouvelles ou complémentaires);
* les tests automatisés de la configuration système;
* une évaluation manuelle de l'application exécutée sur le serveur.

**Attention** : remarques importantes sur le rendu, tout manquement sera sévèrement sanctionné :

* sur votre dépôt GitLab
  - donnez moi les droits `Reporter` sur votre dépôt;
  - il est _absolument interdit_ d'utiliser _un dépôt public_;
  - votre dépôt ne doit _en aucun cas_ contenir des éléments inutiles ou volumineux;
* il faut pouvoir garantir un accès pour la correction automatisée :
  - le _rate limiting_ est interdit;
  - laissez les droits _sudoers_ de l'utilisateur _ubuntu_;
  - gardez la clef `TIW4-VM-authentif.pem` dans `~/.ssh/authorized_keys`.

Certaines mesures qui dans l'absolu devraient être effectuées sont donc **interdites** à mettre en place.
Mettez-les toutefois dans le rapport dans l'état _à faire_ pour montrer que vous y avez pensé et que vous les avez testées.

### Changelog

* 2020-10-03 : restructuration sujet et rendu
* 2020-10-02 : remplacement de <https://pugjs.org> par <https://ejs.co/>
* 2020-10-01 : mise à jour générale

Partie A : mise en place
------------------------

Un serveur Ubuntu 20.04 est fourni à chaque binôme. Son IP est donnée dans Tomuss. La VM a également un nom DNS de la forme `tiw4-authentication-XX.tiw4.os.univ-lyon1.fr` où `XX` est votre numéro de binôme sur un ou deux chiffres (e.g., 1, 2, ..., 10, 11).
Les secrets la clef `TIW4-VM-authentif.pem` d'accès à la VM et la _passphrase_ de la clef privée de la CA vous sont communiqués sur le Discord.

Le fichier [`DEPLOY.md`](./DEPLOY.md) donne des informations sur le déploiement de l'application, sauf la toute fin du document, ce sont les étapes qui ont _déjà été faites_ sur la VM qui vous est fournie.

Une VM de référence avec l'application de départ déployée est accessible à <https://tiw4-authentication-gold.tiw4.os.univ-lyon1.fr/> (IP : 192.168.74.142)

### Travail à faire

* Lisez l'intégralité du sujet familiarisez vous avec l'environnement et l'application **avant** la séance.
* Créez un dépôt **privé** sur <https://forge.univ-lyon1.fr> et _forkez_ le projet de départ GitHub [en y ajoutant un nouveau _remote_](https://stackoverflow.com/questions/50973048/forking-git-repository-from-github-to-gitlab).
* Connectez vous sur la VM, relancez `nginx` et lancez l'application dans `~/helloworld/` puis celle de votre dépôt cloné.
* Corrigez le problème de la redirection `nginx` dans la configuration initiale.

### Questions

Ces questions, sont là pour vous guider, vous aider à comprendre le fonctionnement et à identifier des problèmes de sécurité.
Il n'est pas nécessaire de faire figurer les réponses dans le rapport, mais ce n'est pas interdit.

* quels sont les ports réseaux ouverts ? Attention au point de vu différent selon qu'on scanne depuis `localhost`, internet, le vpn, le wifi ucbl-portail ou wifi eduroam.
* quelles sont les principales caractéristiques techniques de votre VM ?

Partie B : sécurisation système
--------------------------------

Il s'agit de sécuriser le serveur qui vous est attribué et de mettre en place de HTTPS/TLS sur `nginx`.
Pour cela, nous fournissons le matériel cryptographique de l'autorité de certification nommée _tiw4-ca_ ainsi que des configurations OpenSSL dans le dossier [./tiw4-ca](./tiw4-ca).

### Travail à faire

Générez un certificat TLS signé de l'autorité _tiw4-ca_ puis déployer le.
Le fichier [`tiw4-ca/README.md`](tiw4-ca/README.md) détaille la marche à suivre.
Vérifiez que votre certificat fonctionne pour l'IP **et* pour le nom DNS de votre VM.

Si la configuration du front `nginx` est au cœur du sujet, toutes les vulnérabilités niveau système et leurs contre-mesures sont pertinentes, virtuellement tout ce qui ne relève pas du code de l'application _LOGON_ :

* création d'utilisateurs Linux et gestion de leurs droits;
* firewall, fail2ban (peut-être fait dans l'application);
* paramétrage  du _rate limiting_  (**attention** à ne pas le mettre en production ce qui bloquerait les tests automatisés);
* configuration du serveur PostgreSQL et de la base `tiw4_auth`.

### Questions

* Node.js peut aussi faire du https, est-ce mieux que de le faire dans `nginx` ? Pourquoi ?
* Pourquoi dit-on que `tiw4-ca` est une autorité _intermédiaire_ ?
* Dans la configuration initiale de la VM fournie, qui sont l’émetteur et le sujet du certificat utilisé ?
* Quel certificat utilise PostgreSQL pour ses connections TLS ?
* Quels modes d'authentifications sont acceptés par PostgreSQL et depuis quels IPs ?
* Quel est le CN de l’émetteur du certificat (_issuer_) et celui du sujet certifié (_subject_)  dans `tiw4-ca.cert` ?
* Avec la configuration OpenSSL fournie, peut-on utiliser le certificat que vous allez générer pour en signer d'autres ? Pourquoi ?
* Que se passe-t'il si vous utilisez un autre _organizationName_ pour votre serveur ?
* Pourquoi demander pour le serveur une clef RSA 2048 bits et pas 1024 ou 4096 ?
* Après génération d'un certificat, que contient le fichier `index` ?
* Quelle est la durée maximum que vous pouvez raisonnablement donner au certificat que vous allez générer pour votre VM ?

Partie C : sécurisation applicative
-----------------------------------

Il s'agit ici d'identifier toutes les failles ou mauvaises pratiques de l'application web puis de prendre les mesures nécessaires pour sécuriser l'applications.
Les aspects systèmes ayant été traités dans le TP précédent, cette partie est donc consacrée essentiellement à l'application et sa base de données.

### Travail à faire

 Votre attention sur la sécurité applicative sur :

* Le stockage des mots de passes dans PostgreSQL : il faut modifier la méthode utilisée pour stocker et vérifier les mots de passe
* Le processus de création de compte (dureté du mot de passe, vérification de l'email, validité des saisies utilisateurs, mesures anti bots, limitations du nombre de tentatives)
* La sécurité générale de l'application et les bonnes pratiques de développement et de déploiement Node.js.
* La conception d'un processus de récupération du mot de passe via génération d'un token à validité limitée

**Remarque**, si vous pouvez envoyer des emails via `smtp.univ-lyon1.fr:25` avec par exemple [nodemailer](https://nodemailer.com/about/) il est _aussi_ demandé de _simuler_ leur envoi, par exemple en affichant le contenu du mail supposé envoyé dans une page web.

### Questions

* L'application est-elle _stateless_ ?
* Les contraintes d'intégrité SQL de la table `users` vous paraissent-elles satisfaisantes ?
* Qui a les droits sur le schéma `public` de la base de données ?
* Quels sont les droits de l'utilisateur qui exécute l'application _LOGON_ ?
* Qu'est ce qui change entre les mode _development_ et _production_ dans l'application fournie ?
* Quelles autres chosent _pourraient_ ou _devraient_ changer pour l'exécution en production ?
* Que se passe t'il en cas d'exécution concurrente de l'application pour la génération du JWT en mode _production_ ?
* Vérifier le contenu du token généré sur <https://jwt.io>. Quelle est sa durée de validité ?
* Quelles mesure de sécurité vont vous apporter <https://helmetjs.github.io/>

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
  - <https://www.linode.com/docs/web-servers/nginx/tls-deployment-best-practices-for-nginx/>
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
