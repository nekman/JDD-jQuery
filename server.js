var express = require('express'),
    app = express();

app.configure(function() {
  // Static resources  
  app.use(express.static(__dirname + '/', { redirect: false }));

  // Index routes
  app.all('/', function(req, res) {
    res.sendfile('presentation/index.html', { root: __dirname });
  });

  app.all('/date', function(req, res) {
    res.send({
      date: new Date
    });
  });
});

var port = process.env.PORT || 80;
app.listen(port, function() {
 console.log('Listening on', port);
});