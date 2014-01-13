'use strict';

var productProvider = require('./../providers/productProvider');

module.exports = {
  registerRoutes: function(app) {

    // Send all products
    app.all('/products', function(req, res) {
      res.send(productProvider.all());
    });

  }
}