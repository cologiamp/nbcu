var express = require('express');
var path = require('path');

var app = express();

app.use('/', express.static(__dirname + '/build'));
app.set('port', (process.env.PORT || 3000));

app.get('*', function(req, res) {
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(app.get('port'));

console.info('==> NBCU Server is listening ');
console.info('==> Go to http://localhost:%s', app.get('port'));
