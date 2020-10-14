// pour tester DEBUG=* node nodemailer.js "romuald.thion@univ-lyon1.fr"

const nodemailer = require('nodemailer');
const debug = require('debug')('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
async function main(destination) {

  // ici la configuration de base lyon1 (un peu capricieuse ?)
  const transporter = nodemailer.createTransport({
    host: 'smtp.univ-lyon1.fr',
    port: 25,
    secure: false, // true for 465, false for other ports
  });

  // pour la configuration avec gmail : https://nodemailer.com/usage/using-gmail/
  // créer un password pour l'appli https://security.google.com/settings/security/apppasswords
  // puis configurer ainsi

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'youremail@gmail.com',
//       pass: 'le_mot_de_passe_de_votre_appli',
//     },
//   });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'prenom.nom@univ-lyon1.fr', // sender address
    to: destination, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
  });

  debug('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  debug('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main(process.argv[2]).catch(console.error);
