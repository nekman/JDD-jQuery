'use strict';

module.exports = {
  registerRoutes: function(app, session) {    
    var Cart = require('./../store/Cart'),
        cart = new Cart(session);

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
  }
};