'use strict';

const http = require('http');

module.exports = (config, pipe) => {
  const keys = Object.keys(config);
  if (pipe) {
    if (!config[pipe]) {
      throw new Error(`No secret for pipe ${pipe} in given config.`);
    }
    return (message, clb) => module.exports.doRequest(pipe, config[pipe], message, clb);
  }
  return (pipe, message, clb) => {
    if (!clb && keys.length === 1) {
      clb = message;
      message = pipe;
      pipe = keys[0];
    }
    if (!config[pipe]) {
      throw new Error(`No secret for pipe ${pipe} in given config.`);
    }
    return module.exports.doRequest(pipe, config[pipe], message, clb);
  };
};

module.exports.doRequest = (pipe, secret, message, clb) => {
  if (message.length > 4000) {
    message = message.substr(0, 4000);
  }
  pipe = encodeURIComponent(pipe);
  secret = encodeURIComponent(secret);
  message = encodeURIComponent(message);
  const options = {
    host: process.env.TATLER_CLIENT_HOST ? process.env.TATLER_CLIENT_HOST : 'tatler.ekruglov.com',
    path: `/msg/${pipe}/${secret}/?${message}`,
    port: process.env.TATLER_CLIENT_PORT ? process.env.TATLER_CLIENT_PORT : 80,
    timeout: 5000
  };

  const value = new Promise((resolve, reject) => {
    http.request(options, (res) => {
      let str = '';
      res.on('data', (chunk) => {
        str += chunk;
      }).on('end', () => {
        if (str === 'scheduled' && res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`HTTP${res.statusCode}: ${str}`));
        }
      });
    }).on('error', (err) => {
      console.error(`Error happened while sending tatler.ekruglov.com notification: ${err.message}`);
      reject(err.message);
    }).end();
  });

  if (clb) {
    return value.then(clb, clb);
  } else {
    return value;
  }
};
