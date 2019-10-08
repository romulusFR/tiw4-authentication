Matériel cryptographique pour signer un certificat
==================================================

On a utilisé le script suivant pour générer le matériel présent dans ce dossier.

```bash

#génération de la paire RSA racine : sécurité absolue  !
openssl genrsa -aes256 -passout pass:"Eer6ooShoo1quoosh3eifaeToe9fooF3" -out ./root-ca-tiw4.key 4096
chmod 400 ./root-ca-tiw4.key

# on teste le mot de passe et la génération en accédant au contenu de la clef (ici module, exposant privé, exposant public, car dans le cas de RSA)
openssl rsa -passin pass:"Eer6ooShoo1quoosh3eifaeToe9fooF3" -in ./root-ca-tiw4.key -noout -text

# on génère la clef publique à partir de la privée, ça ne sert pas à grand chose car elle sera dans le certificat en fait
openssl rsa -passin pass:"Eer6ooShoo1quoosh3eifaeToe9fooF3" -in ./root-ca-tiw4.key -pubout -out ./root-ca-tiw4.pub

# on génère un certificat auto-signé valable 10 ans
openssl req -passin pass:"Eer6ooShoo1quoosh3eifaeToe9fooF3" -key ./root-ca-tiw4.key -new -x509 -days 3650 -sha256 -extensions v3_ca -out ./root-ca-tiw4.cert -subj "/C=FR/L=Lyon/O=MIF03-CAW Certificate Authority/CN=TIW4-SSI CA"

# on teste en l'affichant
openssl x509 -noout -text -in ./root-ca-tiw4.cert
```
