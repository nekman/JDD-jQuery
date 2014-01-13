'use strict';

var productProvider = require('./../providers/productProvider'),
    _               = require('lodash'),

Cart = function(session) {
  this.cart = session.cart = {};
};

Cart.prototype.store = function(id) {
  var product = productProvider.get(id);

  if (!product) {
    throw 'Could not find product with id = ' + id;
  }

  if (!this.cart[id]) {
    this.cart[id] = [];
  } 
    
  this.cart[id].push(product);

  return product;
};

Cart.prototype.remove = function(id) {
  var products = this.cart[id];
  if (!products) {
    return {
      message: 'No product with id = ' + id + ' in cart'
    };
  }

  var product = products.pop(),
      totalQty = products.length;

  if (!totalQty) {
    delete this.cart[id];
  }

  return {
    message: 'Removed id = ' + id,
    product: product,
    qty: totalQty
  };
};

Cart.prototype.summary = function() {
  return _.map(this.cart, function(products) {
    var result = {
      linePrice: 0,
      qty: products.length,
      product: products[0]
    };

    _.each(products, function(product) {
      result.linePrice += product.price;
    });

    return result;
  });
};

Cart.prototype.total = function() {
  var summary = this.summary(),
      unit = '$',
      totalPrice = 0;

  summary.forEach(function(item) {
    totalPrice += item.linePrice;
  });

  return { totalPrice: totalPrice + unit };
};

module.exports = Cart;