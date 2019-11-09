/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
const express = require('express');
const fetch = require('node-fetch');
const sha512 = require('js-sha512');
const bcrypt = require('bcryptjs');

const db = require('../models/queries');

const router = express.Router();

router.get('/', function signupHandler(_req, res, _next) {
  res.render('signup', { title: 'TIW4 -- LOGON' });
});

router.post('/', async function signupHandler(req, res) {
  const errors = [];
  saltRounds = 10;
  const maillower = req.body.email.toLowerCase();
  const loginlower = req.body.username.toLowerCase();
  const secretKey = process.env.CAPTCHA_SECRET_KEY;
  const recaptcha = req.body.captcha;
  /* ==========================================Controle de saisie ========================================================== */
  // Vérfier que le username n'est pas vide
  const logvide = loginlower.length === 0;
  if (logvide)
    errors.push({
      type: 'logvide',
      msg: `Le login ne doit pas être vide`
    });

  // vérifier l'existance du nom d'utilisateur dans la base de données
  const loginpresent = await db.checkUserNameExistance(loginlower);
  // Si le username est déjà présent on retourne une erreur
  if (loginpresent)
    errors.push({
      type: 'loginpresent',
      msg: `L'utilisateur ${username} existe déjà`
    });

  let checkp = true;
  // Vérifier si le mot de passe est conforme
  await checkPassword(req.body.password).catch(() => (checkp = false));
  if (!checkp)
    errors.push({
      type: 'checkPassword',
      msg:
        'Le mot de passe doit contenir aux moins 8 caractères, un caractère majuscule ...'
    });

  // Vérifier si les deux mots se corréspondent
  const passCorspond = req.body.password === req.body.confirmPassword;
  if (!passCorspond)
    errors.push({
      type: 'passCorspond',
      msg: 'Les mots de passes ne se correspondent pas'
    });

  // Vérifier que l'email n'existe pas déjà dans la bdd
  const mailpresnet = await db.checkMailExistance(maillower);
  // Si l'email est déjà présent on retourne une erreur
  if (mailpresnet)
    errors.push({
      type: 'mailpresnet',
      msg: "L'email existe déjà dans la base de données"
    });

  // Vérifier si l'email est conforme
  let checkm = true;
  await checkEmail(maillower).catch(() => (checkm = false));
  if (!checkm)
    errors.push({
      type: 'checkm',
      msg: "L'email n'est pas conforme"
    });

  /* ==========================================Vérification reCaptcha========================================================== */

  // verifier si le captcha est bien selectionner
  let errorCaptcha = false;
  if (!req.body.captcha) {
    errorCaptcha = true;
    errors.push({
      type: 'captcha',
      msg: ' Veuillez selectionner le captcha  '
    });
  }

  // Verify URL (la validité du captcha)
  const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`;
  const body = await fetch(verifyURL).then((r) => r.json());
  // If not successful
  if (body.success !== undefined && !body.success) {
    errorCaptcha = true;
    errors.push({
      type: 'captchaInvalid',
      msg: " le captcha n'est plus valide  "
    });
  }

  if (
    logvide ||
    loginpresent ||
    !checkp ||
    !passCorspond ||
    mailpresnet ||
    !checkm ||
    errorCaptcha
  ) {
    return res.json({ success: false, errors: JSON.stringify(errors) });
  }

  /* ==========================================Vérification Mail========================================================== */

  // If successful
  // utiser le hashage SHA512
  const hashedPassword = sha512(req.body.password);

  // utiliser bcrypt
  const encryptedPassword = bcrypt.hashSync(hashedPassword, saltRounds);
  await db.addUser(req.body.username, req.body.email, encryptedPassword);
  return res.json({ success: true, errors: JSON.stringify('') });
});

function checkPassword(password) {
  return new Promise((resolve, reject) => {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    strongRegex.test(password) ? resolve() : reject();
  });
}

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    const mailregex = new RegExp(
      '^([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+).([a-zA-Z]{2,6})$'
    );
    mailregex.test(email) ? resolve() : reject();
  });
}

module.exports = router;
