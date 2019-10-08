#!/bin/bash
# Petit script pour générer les .pdfs des parties et zipper tous le dossier ./contenu

cd rendu

for part in PARTIE-A PARTIE-B
  do 
    pandoc "$part".md -t latex -s -o "$part".tex
    pdflatex "$part".tex
    pdflatex "$part".tex
    rm *.{aux,log,tex}
 done

zip -r  ../MODELE_RENDU.zip *
cd ..