'use strict';

var express = require('express'),
    app = express(),
    cartRoute = require('./routes/cartRoute'),
    productRoute = require('./routes/productRoute'),
    productProvider = require('./providers/productProvider');

cartRoute.registerRoutes(app, express.session);
productRoute.registerRoutes(app);

app.configure(function() {
  // Static resources  
  app.use(express.static(__dirname + './../', { redirect: false }));

  // Session
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));

  // Index
  app.all('/', function(req, res) {
    res.render('./views/index.html');
  });

  app.get('/shoppingcart', function(req, res) {
    res.render('./views/iframes/shoppingcart.html', {
      products: productProvider.all(),
      script: req.query.script
    });
  });

  // Server date
  app.all('/date', function(req, res) {
      res.send({
      date: new Date
    });
  });

  // Send back post data
  app.post('/echo', express.bodyParser(), function(req, res) {
    res.send({
      echo: req.body
    });
  });
});

app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.engine('.html', require('ejs').__express);

var port = process.env.PORT || 80;
app.listen(port, function() {
 console.log('Listening on', port);
});