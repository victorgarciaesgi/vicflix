var express = require('express');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');

var app = express();
var PORT = 5100;

app.use(morgan('tiny'));
app.get('*.js', function(req, res, next) {
  var url = req.url + '.gz';
  console.log('./dist' + url);
  if (fs.existsSync('./dist' + url)) {
    req.url = url;
    res.set('Content-Encoding', 'x-gzip');
    res.set('Content-Type', 'application/gzip');
    res.set('Accept-Encoding', ' gzip, compress, br');
  }
  //Send gzipped file to production client
  next();
});
app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});
app.listen(PORT, function() {
  console.log('App listening on port ' + PORT);
});
