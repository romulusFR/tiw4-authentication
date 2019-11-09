/* eslint-disable no-undef */

document.getElementById('subscribeForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#pw').value;
  const confirmPassword = document.querySelector('#pw2').value;
  const captcha = document.querySelector('#g-recaptcha-response').value;

  const usernameError = document.querySelector('#usernameError');
  const emailError = document.querySelector('#emailError');
  const passwordError = document.querySelector('#passwordError');
  const confirmPasswordError = document.querySelector('#confirmPasswordError');
  const captchaError = document.querySelector('#captchaError');

  usernameError.innerHTML = '';
  emailError.innerHTML = '';
  passwordError.innerHTML = '';
  confirmPasswordError.innerHTML = '';
  captchaError.innerHTML = '';

  const inputs = JSON.stringify({
    username,
    email,
    password,
    confirmPassword,
    captcha
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: inputs
  };

  return fetch('/signup', options)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        let boolCaptcha = true;
        grecaptcha.reset();

        errors = JSON.parse(data.errors);
        errors.forEach((error) =>{
          if (error.type === 'logvide') usernameError.innerHTML = error.msg;
          if (error.type === 'checkm') emailError.innerHTML = error.msg;
          if (error.type === 'checkPassword')
            passwordError.innerHTML = error.msg;
          if (error.type === 'errconfpass')
            confirmPasswordError.innerHTML = error.msg;
          if (error.type === 'captcha') {
            captchaError.innerHTML = error.msg;
            boolCaptcha = false;
          }
          if (error.type === 'captchaInvalid' && boolCaptcha)
            captchaError.innerHTML = error.msg;
        });
      } else {
        return window.location.replace('/');
      }
      return 0;
    });
});
