Autorité de certification (CA) intermédiaire `tiw4-ca`
======================================================

Ici on donne le matériel cryptographique d'une autorité de certification appellée `tiw4-ca` :

- une clef privée `tiw4-ca.key` protégée par une _passphrase_;
- un certificat `tiw4-ca.cert` signé par une autorité racine;
- un certificat `tiw4-ca-chain.cert` le précédent auquel est concaténé le certificat de la racine.

Ce matériel sert à générer le certificat TLS de votre serveur.
Il y a donc un _jeu de rôles_ où vous utiliserez OpenSSL :

- en tant qu'**utilisateur**, pour créer une paire RSA puis un CSR pour votre VM;
- en tant que **CA**, pour générer le certificat TLS.

Il faut qu'à la fin, chaque VM ait un certificat signé de l'autorité.
Si le certificat de l'autorité est dans la liste du navigateur, alors le site sera reconnu en HTTPS sans erreur.

La référence principale

```bash
# pour vérifier le contenu de la clef de la CA
openssl rsa -passin pass:"LeMotDePasseSecretDeLaCA" -in ./tiw4-ca.key -noout -text
```
SIGNING_CA_SNAME
SIGNING_CA_DIR