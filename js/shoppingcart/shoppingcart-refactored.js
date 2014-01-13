/**
 * Ett renare exempel av shoppingcart.
 * Använder "pubsub.js" som visades på patterns föreläsningen. 
 *
 * Nedanstående fungerar bättre och är enklare att resonera kring
 * än koden i "shoppingcart-spagetti.js".
 *
 */

(function($) {
  'use strict';
  
  /**
   * Modellen.
   * 
   * Hämtar data från servern, uppdaterar sig (kommunikationen med servern 
   * kunde självklart gjorts av en Controller istället, som i sin tur uppdaterat
   * modellen, men för detta use case duger nedanstående).
   *
   * och publicerar events när den gjort detta, så att vyerna kan rendera om sig.
   *
   * Värt att notera är att modellen inte har någon koppling till DOM:en.
   */
  var CartModel = function() {};

  // Såhär bör man inte göra, då man skriver över hela prototypen.
  // Kunde använt jQuery.extend(CartModel.prototype, {}) istället.
  CartModel.prototype = {

    fetchTotalPrice: function() {
      return $.ajax({
        url: '/cart/total',
        method: 'POST'
      });  
    },

    fetchCartProducts: function() {
      return $.ajax({
        url: '/cart/summary',
        method: 'POST'
      });  
    },

    /** Ta bort en produkt.  */
    remove: function(productId) {
      var promise = $.ajax({
        url: '/cart/remove/' + productId,
        method: 'POST'
      });

      $.publish('/message/remove', 
                'Tagit bort '+ productId);

      // NOTE: Kunde även skrivit 'this.fetch.bind(this)'
      promise.done($.proxy(this.fetch, this));
    },

    /** Ta bort en produkt.  */
    store: function(productId) {
      var promise = $.ajax({
        url: '/cart/store/' + productId,
        method: 'POST'
      });

      $.publish('/message/store', 
                'Lagt till '+ productId);

      // NOTE: Kunde även skrivit 'this.fetch.bind(this)'
      promise.done($.proxy(this.fetch, this));
    },

    /*
     * Hämtar data från servern, och uppdaterar sig.
     */
    fetch: function() {
      var publish = function(price, cartitems) {
        this.totalPrice = price && price[0].totalPrice;
        this.cartitems = cartitems && cartitems[0];

        $.publish('/fetch');      
      };

      // När både "fetchTotalPrice" och "fetchCartProducts"
      // är klara, uppdatera model och anropa 'publish' ovan 
      // för att subscribers (vyer) ska veta när de ska rendera om sig.
      $.when(
        this.fetchTotalPrice(),
        this.fetchCartProducts()

        //NOTE: Kunde även skrivit 'publish.bind(this)'
      ).done($.proxy(publish, this));

      return this;
    }  
  };

  /**
   * Visar meddelanden när användaren lagt till / tagit bort något.
   */
  var CartMessageView = function() { 
    this.$el = $('#message');

    $.subscribe('/message/store', this, this.render);
    $.subscribe('/message/remove', this, this.render);
  };

  CartMessageView.prototype.render = function(message) {
     this.$el
         .stop(true, true)
         .show()
         .addClass('alert-success')
         .show().html(message)
         .fadeOut(3000);
  };

  var CartView = function(model) {
    this.$cart = $('#cart table > tbody');
    this.$totalAmount = $('#total');
    this.model = model;

    this.registerEvents();

    $.subscribe('/fetch', this, this.render);
  };

  CartView.prototype = {
    // Template för att 
    template: '<tr>' +
              '   <td>{{name}}</td>' +
              '   <td>{{qty}}</td>' +
              '   <td>{{linePrice}}$</td>' +
              '   <td><button data-id="{{productId}}" class="remove btn">X</button></td>' +
              '</tr>',

    registerEvents: function() {
      var model = this.model;

      this.$cart.on('click', 'button.remove', function() {
        var productId = $(this).data('id');

        model.remove(productId);
      });      
    },
    
    render: function() {
      this.$totalAmount.html(
        this.model.totalPrice
      );

      var template = this.template,
          orderlines = [];

      $.each(this.model.cartitems, function(index, item) {
        orderlines.push(
          template.replace('{{name}}', item.product.name)
                  .replace('{{qty}}', item.qty)
                  .replace('{{linePrice}}', item.linePrice)
                  .replace('{{productId}}', item.product.id)
        );
      });

      this.$cart.empty().html(orderlines.join(''));
    }
  };

  var ProductView = function(model) {
    this.model = model;

    this.$products = $('#products');
    this.registerEvents(); 
  };

  ProductView.prototype.registerEvents = function() {
    var model = this.model;

    this.$products.on('click', 'button.add', function store() {
      var productId = $(this).data('id');

      model.store(productId);
    });
  };

  /**
   * Exponera som globalt ShoppingCart objekt (BUUU!)
   * 
   * Gör endast detta för att vi ska kunna enhetstesta.
   * Hade varit mycket finare att låta 
   * CartModel, CartView och ProductView ligga i egna
   * filer och ladda in dessa med AMD...
   * 
   * Gör dock inte detta, då det ligger utanför scopet.
   */
  window.ShoppingCart = {
    CartModel: CartModel,
    CartView: CartView,
    ProductView: ProductView,

    init: function() {
      $(document).ready(function() {
        var model = new CartModel;

        new CartMessageView;        
        new CartView(model);
        new ProductView(model);

        model.fetch();
      });      
    }
  };

}(jQuery));