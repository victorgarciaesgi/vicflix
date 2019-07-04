var express = require('express');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
const expressStaticGzip = require('express-static-gzip');

var app = express();
var PORT = process.env.PORT || 5999;

app.use(
  expressStaticGzip(path.resolve(__dirname, 'dist'), {
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
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});
app.listen(PORT, () => {
  console.log('App listening on port ' + PORT);
});
