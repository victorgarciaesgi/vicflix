const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const dotenv = require('dotenv-extended');
var os = require('os');

const stage = process.env.NUXT_ENV_STAGE;
const envs = dotenv.load({ path: `.env.${stage}` });

const app = express();
const PORT = process.env.NUXT_ENV_PORT || 5999;

app.use(
  expressStaticGzip(path.resolve(__dirname, '../dist'), {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: (res, path) => {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('service-worker', 'script');
    },
  })
);
app.get('/*', (req, res) => {
  res.set('Service-Worker-Allowed', '/');
  res.set('service-worker', 'script');
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});
app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));
