'use strict';

const tatler = require('../');
const assert = require('assert');
const express = require('express');

process.env.TATLER_CLIENT_HOST = '127.0.0.1';
process.env.TATLER_CLIENT_PORT = 4000;
process.env.TATLER_PREFER_HTTP = 'yes';

describe('Tatler-client send request', function () {
  let app = null;
  let server;
  let url;

  before((done) => {
    app = express();
    app.get('/msg/*', (req, res) => {
      url = req.url;
      if (!url.startsWith('/msg/fakepipe/')) {
        return res.status(404).end();
      }
      if (!url.startsWith('/msg/fakepipe/PasswordCorrect/?')) {
        return res.status(403).end();
      }

      res.send('scheduled');
    });
    server = app.listen(4000, done);
  });
  beforeEach(() => {
    url = null;
  });
  after((done) => {
    server.close(done);
  });

  it('Client with correct long call and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' });
    client('fakepipe', 'Faked Message', (err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with correct short call and callback with one pipe and with pipe in call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect' });
    client('Faked Message', (err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with correct short call and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' }, 'fakepipe');
    client('Faked Message with some ch@rs!', (err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message%20with%20some%20ch%40rs!');
      done();
    });
  });

  it('Client with correct short call with one pipe and without pipe in call and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' }, 'fakepipe');
    client('Faked Message with some ch@rs!', (err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message%20with%20some%20ch%40rs!');
      done();
    });
  });

  it('Client with correct long call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' });
    client('fakepipe', 'Faked Message').then((err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with correct short call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' }, 'fakepipe');
    client('Faked Message with some ch@rs!').then((err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message%20with%20some%20ch%40rs!');
      done();
    });
  });

  it('Client with correct short call with one pipe and with pipe in call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect' });
    client('fakepipe', 'Faked Message with some ch@rs!').then((err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message%20with%20some%20ch%40rs!');
      done();
    });
  });

  it('Client with correct short call with one pipe and without pipe in call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect' });
    client('Faked Message with some ch@rs!').then((err) => {
      assert.ifError(err);
      assert.strictEqual(url, '/msg/fakepipe/PasswordCorrect/?Faked%20Message%20with%20some%20ch%40rs!');
      done();
    });
  });

  // Incorrect checks starts

  it('Client with wrong pipe and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' });
    client('fakepipe2', 'Faked Message', (err) => {
      assert.strictEqual(err.message, 'HTTP404: ');
      assert.strictEqual(url, '/msg/fakepipe2/PasswordInCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with wrong password and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordInCorrect', fakepipe2: 'PasswordInCorrect' }, 'fakepipe');
    client('Faked Message', (err) => {
      assert.strictEqual(err.message, 'HTTP403: ');
      assert.strictEqual(url, '/msg/fakepipe/PasswordInCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with wrong pipe and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect', fakepipe2: 'PasswordInCorrect' });
    client('fakepipe2', 'Faked Message').catch((err) => {
      assert.strictEqual(err.message, 'HTTP404: ');
      assert.strictEqual(url, '/msg/fakepipe2/PasswordInCorrect/?Faked%20Message');
      done();
    });
  });

  it('Client with wrong password and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordInCorrect', fakepipe2: 'PasswordInCorrect' }, 'fakepipe');
    client('Faked Message').catch((err) => {
      assert.strictEqual(err.message, 'HTTP403: ');
      assert.strictEqual(url, '/msg/fakepipe/PasswordInCorrect/?Faked%20Message');
      done();
    });
  });
});
describe('Tatler-client non-sendable request', function () {
  it('Client with incorrect setup', () => {
    assert.throws(() => {
      tatler({}, 'fakepipe');
    }, Error);
  });
  it('Client with correct setup and incorrect call', () => {
    const client = tatler({});
    assert.throws(() => {
      client('fakepipe', 'Faked Message');
    }, Error);
  });
  it('Client with correct setup and incorrect call and callback', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect' });
    client('fakepipe', 'Faked Message', (err) => {
      assert.strictEqual(err, 'connect ECONNREFUSED 127.0.0.1:4000');
      done();
    });
  });
  it('Client with correct setup and incorrect call and promise', (done) => {
    const client = tatler({ fakepipe: 'PasswordCorrect' });
    client('fakepipe', 'Faked Message').catch((err) => {
      assert.strictEqual(err, 'connect ECONNREFUSED 127.0.0.1:4000');
      done();
    });
  });
});
