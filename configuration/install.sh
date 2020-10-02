#!/bin/bash

# update générale
sudo apt-get -y update
sudo apt-get -y upgrade

# ajout des dépots
# https://github.com/nodesource/distributions#debinstall
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -


# installation nginx, postgresql-13 et node.js

sudo apt-get update
sudo apt-get install -y nginx ssl-cert
sudo apt-get install -y nodejs
sudo apt-get -y install postgresql-13

sudo nginx -v
#nginx version: nginx/1.18.0 (Ubuntu)
node -v
# v14.13.0
npm -v
# 6.14.8
sudo -u postgres psql -c "SELECT version();"
#                                                           version
# ----------------------------------------------------------------------------------------------------------------------------
#  PostgreSQL 13.0 (Ubuntu 13.0-1.pgdg20.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 9.3.0-10ubuntu2) 9.3.0, 64-bit

# puis suivre https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
# pour permettre 