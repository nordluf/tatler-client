# TatlerBot NodeJS client

![](https://github.com/nordluf/tatler-client/workflows/Node%20CI/badge.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![semantic-release](https://img.shields.io/badge/semver-semantic%20release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![NPM](https://nodei.co/npm/tatler-client.png)](https://nodei.co/npm/tatler-client/)

NodeJS client for sending notifications to [@TatlerBot](https://t.me/tatlerbot) Telegram bot. 

Usage:
```javascript
const tatler = require('tatler-client');
const clientLong = tatler({PipeName: 'PipeSecret', Pipe2Name: 'Pipe2Secret', ...});
clientLong('PipeName', 'Any message', callback);
clientLong('Pipe2Name', 'Any message').then(handler);

const clientShort = tatler({PipeName: 'PipeSecret', Pipe2Name: 'Pipe2Secret', ...}, 'PipeName');
clientShort('Any message', callback);
clientShort('Any message').then(handler);
```
