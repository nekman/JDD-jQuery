'use strict';

var _ = require('lodash'),

ProductProvider = function() {
  this.products = Object.freeze([
    Object.freeze({
      id: '1',    
      name: 'jQuery for beginners',
      price: 10
    }),

    Object.freeze({
      id: '2',      
      name: 'jQuery plugins',
      price: 15
    }),

    Object.freeze({
      id: '3',      
      name: 'Pro jQuery',
      price: 30
    })

  ]);
};

ProductProvider.prototype.get = function(id) {
  return _.find(this.products, function(product) {
    return product.id === id;
  });
};

ProductProvider.prototype.all = function() {
  return this.products;
};

module.exports = new ProductProvider;