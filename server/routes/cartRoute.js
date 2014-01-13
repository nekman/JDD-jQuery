'use strict';

module.exports = function(app, express) {

  var productProvider = require('./../providers/productProvider'),
      Cart = require('./../store/Cart');

  var cart = new Cart(express.session);

  // Send all products
  app.all('/products', function(req, res) {
    res.send(productProvider.all());
  });

   // Send cart
  app.all('/cart', function(req, res) {
    res.send(cart);
  });

  app.all('/cart/summary', function(req, res) {
    res.send(cart.summary());
  });

  app.all('/cart/total', function(req, res) {
    res.send(cart.total());
  });

  // Store product
  app.post('/cart/store/:id', function(req, res) {
    var result = cart.store(req.params.id);
    
    res.send(result);
  });

  // Remove product
  app.post('/cart/remove/:id', function(req, res) {
    var result = cart.remove(req.params.id);
    
    res.send(result);
  });

};   

