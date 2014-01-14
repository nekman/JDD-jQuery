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
   * Hämtar data från servern, uppdaterar sig och publicerar events när den gjort detta, 
   * så att vyerna kan rendera om sig.
   * 
   * Kommunikationen med servern 
   * kunde självklart gjorts av en Controller istället, som i sin tur uppdaterat
   * modellen, men för detta use case duger nedanstående.
   *
   * Värt att notera är att modellen inte har någon koppling till DOM:en.
   */
  var CartModel = function() {};

  // Såhär bör man inte göra, då man skriver över hela prototypen.
  // Kunde använt jQuery.extend(CartModel.prototype, {}) istället.
  CartModel.prototype = (function() {
    // private
    var sendMessage = function(topicName, message) {      
      return function() {
        $.publish(topicName, {
          topic: topicName,
          value: message
        });
      };
    },

    update = function(price, cartitems) {
      this.totalPrice = price && price[0].totalPrice;
      this.cartitems = cartitems && cartitems[0];

      $.publish('/fetch');      
    };

    return {
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

        // NOTE: Kunde även skrivit 'this.fetch.bind(this)'
        promise
          .then(sendMessage('/message/remove', 'Tagit bort ' + productId))
          .done($.proxy(this.fetch, this))
          .fail(sendMessage('/message/fail', 'Kunde ej ta bort ' + productId));
      },

      /** Ta bort en produkt.  */
      store: function(productId) {
        var promise = $.ajax({
          url: '/cart/store/' + productId,
          method: 'POST'
        });

        // NOTE: Kunde även skrivit 'this.fetch.bind(this)'
        promise
          .then(sendMessage('/message/store', 'Lagt till ' + productId))
          .done($.proxy(this.fetch, this))
          .fail(sendMessage('/message/fail', 'Kunde ej lägga till ' + productId));
      },

      /*
       * Hämtar data från servern, och uppdaterar sig.
       */
      fetch: function() {
        // När både "fetchTotalPrice" och "fetchCartProducts"
        // är klara, uppdatera model och anropa 'update' ovan 
        // för att subscribers (vyer) ska veta när de ska rendera om sig.
        $.when(
          this.fetchTotalPrice(),
          this.fetchCartProducts()
        ).done($.proxy(update, this));

        return this;
      }  
    };
  }());

  /**
   * Visar meddelanden när användaren lagt till / tagit bort något.
   */
  var CartMessageView = function() { 
    this.$el = $('#message');

    $.subscribe('/message/store', this, this.render);
    $.subscribe('/message/remove', this, this.render);
    $.subscribe('/message/fail', this, this.render);
  };

  CartMessageView.messageTypes = {
    '/message/store' : 'alert alert-success',
    '/message/remove': 'alert alert-info',
    '/message/fail'  : 'alert alert-danger'
  };

  CartMessageView.prototype.render = function(message) {
     console.log(message);

     this.$el
         .stop(true, true)
         .show()
         .attr('class', CartMessageView.messageTypes[message.topic])
         .show().html(message.value)
         .fadeOut(3000);

      return this;
  };

  var CartView = function(model) {
    this.$cart = $('#cart table > tbody');
    this.$totalAmount = $('#total');
    this.model = model;

    this.registerEvents();

    $.subscribe('/fetch', this, this.render);
  };

  CartView.prototype = {
    // Template som kan återanvändas när vi ska lägga in nya rader i varukorgen.
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
    
    /* Renderar varukorgen */
    render: function() {
      // Skriv ut totalbelopp
      this.$totalAmount.html(
        this.model.totalPrice
      );

      var template = this.template,
          lines = [];

      // Skriv ut rader i varukorgen
      $.each(this.model.cartitems, function(index, item) {
        lines.push(
          template.replace('{{name}}', item.product.name)
                  .replace('{{qty}}', item.qty)
                  .replace('{{linePrice}}', item.linePrice)
                  .replace('{{productId}}', item.product.id)
        );
      });

      this.$cart.empty().html(lines.join(''));

      return this;
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