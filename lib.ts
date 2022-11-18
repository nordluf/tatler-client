import http from 'http';

export interface Configs {
  [pipe: string]: string | undefined;
}

export type Callback = (value?: any) => void;

function tatler<T extends Configs, K extends keyof T> (config: T, pipe?: K | boolean, throwError = true) {
  const keys = Object.keys(config);
  if (typeof pipe === 'boolean') {
    throwError = pipe;
    pipe = undefined;
  } else if (typeof pipe === 'string') {
    if (!config[pipe] && throwError) {
      throw new Error(`No secret for pipe ${pipe} in given config.`);
    }
    return (message: string, clb?: Callback) => tatler.doRequest(pipe as string, config[pipe as K], message, clb, throwError);
  }

  return (pipe: K | string, message?: string | Callback, clb?: Callback) => {
    if (!clb && keys.length === 1 && (!message || typeof message === 'function')) {
      clb = message as Callback;
      message = pipe as string;
      pipe = keys[0];
    }
    return tatler.doRequest(pipe as string, config[pipe], message as string, clb, throwError);
  };
}

function doRequest (pipe: string, secret: string | undefined, message: string, clb: Callback | undefined, throwError: boolean) {
  let value = Promise.resolve();
  if (secret) {
    pipe = encodeURIComponent(pipe);
    secret = encodeURIComponent(secret);

    let limit = 4000;
    do {
      const encoded = encodeURIComponent(message.substr(0, limit));
      if (encoded.length > 6144) {
        limit -= 100;
        continue;
      }

      message = encoded;
      break;
    } while (limit > 0);

    const options = {
      host: process.env.TATLER_CLIENT_HOST ? process.env.TATLER_CLIENT_HOST : 'tatler.jsbot.eu',
      path: `/msg/${pipe}/${secret}/?${message}`,
      port: process.env.TATLER_CLIENT_PORT ? process.env.TATLER_CLIENT_PORT : 80,
      timeout: 5000
    };

    value = new Promise((resolve, reject) => {
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
        console.error(`Error happened while sending tatler.jsbot.eu notification: ${err.message}`);
        reject(err.message);
      }).end();
    });
  } else if (throwError) {
    throw new Error(`No secret for pipe ${pipe} in given config.`);
  }

  if (clb) {
    return value.then(clb, clb);
  } else {
    return value;
  }
}

tatler.doRequest = doRequest;

export default tatler;
