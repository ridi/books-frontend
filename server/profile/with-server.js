const next = require('next');
const path = require('path');
const fs = require('fs');
const https = require('https');

const { createConfig, injectConfig } = require('../../env/publicRuntimeConfig');
const { createServer } = require('../common');
const { profile } = require('./core');

require('dotenv').config({
  path: path.resolve(__dirname, 'profile.env'),
});
injectConfig(createConfig());

const dev = true;
const app = next({ dev, dir: path.resolve(__dirname, '../../src') });
const expressServer = createServer(app, dev);

const port = 8443;
(async () => {
  const [key, cert] = await Promise.all([
    fs.promises.readFile(path.resolve(__dirname, 'self.key')),
    fs.promises.readFile(path.resolve(__dirname, 'self.cert')),
    app.prepare(),
  ]);
  const server = await new Promise(resolve => {
    const server = https.createServer({ key, cert }, expressServer).listen(port);
    server.on('listening', () => resolve(server));
  });
  await profile(publicRuntimeConfig.BOOKS_HOST);
  server.close();
})().then(
  () => {
    process.exit(0);
  },
  err => {
    console.error(err);
    process.exit(1);
  },
);
