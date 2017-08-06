# TatlerBot NodeJS client

[![Build Status](https://travis-ci.org/nordluf/tatler-client.svg?branch=master)](https://travis-ci.org/nordluf/tatler-client)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/abeaa6ecaeed41feb173a0a74fd1966e)](https://www.codacy.com/app/nordluf/tatler-client?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nordluf/tatler-client&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/abeaa6ecaeed41feb173a0a74fd1966e)](https://www.codacy.com/app/nordluf/tatler-client?utm_source=github.com&utm_medium=referral&utm_content=nordluf/tatler-client&utm_campaign=Badge_Coverage)
[![NPM](https://nodei.co/npm/tatler-client.png)](https://nodei.co/npm/tatler-client/)

NodeJS client for sending notifications to [@TatlerBot](https://t.me/tatlerbot) Telegram bot. 

Usage:
```javascript
const tatler = require('tatler-client');
const clientLong = tatler({PipeName: 'PipePassword', Pipe2Name: 'Pipe2Password', ...});
clientLong('PipeName', 'Any message', callback);
clientLong('Pipe2Name', 'Any message').then(handler);

const clientShort = tatler({PipeName: 'PipePassword', Pipe2Name: 'Pipe2Password', ...}, 'PipeName');
clientShort('Any message', callback);
clientShort('Any message').then(handler);
```