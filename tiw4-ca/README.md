Autorité de certification (CA) intermédiaire `tiw4-ca`
======================================================

Ici on donne le matériel cryptographique d'une autorité de certification intermédiaire appellée `tiw4-ca`.
Ce matériel sert à générer le certificat TLS de votre serveur.
Il y a donc un _jeu de rôles_ où vous utiliserez OpenSSL :

- en tant qu'**utilisateur**, pour créer une paire RSA puis un CSR pour votre VM;
- en tant que **CA**, pour générer le certificat TLS.

Il faut qu'à la fin, chaque VM ait un certificat signé de l'autorité.
Si le certificat de l'autorité est dans la liste du navigateur, alors le site sera reconnu en HTTPS sans erreur.

**IMPORTANT** : la référence principale utilisée pour la génération est <https://jamielinux.com/docs/openssl-certificate-authority/sign-server-and-client-certificates.html>, consultez la.

openssl x509 -noout -text -in ./root-ca-tiw4.cert

Matériel fourni
---------------

- `conf/client.conf` : configuration OpenSSL pour la génération du CSR pour le serveur
- `conf/tiw4-ca.conf` : configuration OpenSSL pour la génération du certificat à partir du CSR
- `certs/tiw4-ca.cert` : certificat de l'autorité, signé par une autorité racine
- `certs/tiw4-ca-chain.cert` : certificat de l'autorité concaténé au certificat de la racine
- `private/tiw4-ca.key` : clef privé de l'autorité protégée par une _passphrase_;

Les fichiers de configuration `.conf` sont à utiliser avec l'option `-config` de OpenSSL.
Ils s'appuient sur le svariables d'environnement suivantes à charger avant l'exécution d'OpenSSL :

```bash
export BASE_COUNTRY="FR"
export BASE_STATE="Auvergne-Rhône-Alpes"
export BASE_LOCALITY="Villeurbanne"
export BASE_ORG="Université Claude Bernard - Lyon 1"
export BASE_OU="Département Informatique"
export BASE_CN="Autorité de Certification (AC) (TIW4-CA)"
export BASE_SAN="email:romuald.thion@univ-lyon1.fr"
```

Il faudra par contre définir **vous mêmes** les variables suivantes :

- `CLIENT_CN` : le _Common Name_ de votre VM
- `CLIENT_SAN` : le subject alternative name, ici l'IP de votre VM

Questions de compréhension
--------------------------

- pourquoi dit-on que `tiw4-ca` est une autorité _intermédiaire_ ?
- quel est le CN de l’émetteur du certificat (issuer) dans `tiw4-ca.cert` ?
- quel est le CN du sujet certifié (subject) dans `tiw4-ca.cert`?
- avec la configuration donnée, peut-on utiliser le certificat que vous allez générer pour en signer d'autres ? Pourquoi ?
- que se passe-t'il si vous utilisez un autre _organizationName_ pour votre serveur ?
- pourquoi demander pour le serveur une clef RSA 2048 bits et pas 1024 ou 4096 ?

Exemples
--------

```bash
# pour vérifier le contenu de la clef de la CA
openssl rsa -passin pass:"LeMotDePasseSecretDeLaCA" -in ./tiw4-ca.key -noout -text

# pour afficher le certificat la CA
openssl x509 -in tiw4-ca.cert -noout -text
```
