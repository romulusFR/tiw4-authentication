// eslint-disable-next-line no-undef
const xmlhttpRequest = new XMLHttpRequest();
const cycle = 30 * 1000;

setInterval(() => {
  xmlhttpRequest.onloadend = () => {
    if (xmlhttpRequest.status === 200) console.log('token mise à jour');
  };
  xmlhttpRequest.open('POST', '/refresh', false);
  xmlhttpRequest.send();
}, cycle);
