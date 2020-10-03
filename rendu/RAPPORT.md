TIW4 2020-2021 "TP authentification" : rapport partie A
=======================================================

Partie A
--------

Partie B
--------

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


### Mesures mises en place

Ici, proposez un tableau de synthèse des mesures de sécurité mises en place.
On donnera _pour chaque mesure_ réalisée :

  - une courte description du problème;
  - une courte description de la mesure proposée;
  - une référence de justification du choix
  - un renvoi vers l'annexe pour les détails.


Partie C
--------

Similairement à la précédente, la partie B du rapport sera composée comme suit :

* d'un tableau des mesures de sécurité et nouvelles fonctionnalités mises en place, avec renvoi vers l'annexe. Le tableau constitue c'est l'essentiel du rapport. On donnera _pour chaque mesure_ identifiée :
  - une description du problème
  - la mesure proposée et la justification de son choix
  - un renvoi _précis_ (fichier et numéro de ligne) vers l'annexe pour les détails de la mesure technique et des de leurs justifications détaillée
* une conclusion sous la forme d'une évaluation de la sécurité vis-à-vis des bonnes pratiques de l'état de l'art
* les annexes : tous les extraits du code source, scripts et références utiles à la description des mesures ou fonctionnalités et de leurs justifications.

Vous veillerez en particulier à bien détailler les mesures/fonctionnalités relatives au point 1 à 4 cités plus haut (_stockage des mots de passes_, _processus d'authentification_, _création de compte_ et _récupération du mot de passe_).

L'ensemble du code **et** des scripts nécessaires au déploiement (notamment les scripts SQL) est fournie dans une autre annexe générale.


Annexes
-------

Ici les extraits de code, de configuration ou de documentation utiles pour détailler les parties précédentes.
