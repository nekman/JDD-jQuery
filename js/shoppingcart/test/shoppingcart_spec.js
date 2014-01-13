/*
 * Jasmine-tester för ShoppingCart.
 * Kan utökas och göras bättre.
 * 
 * Återigen hade man här kunnat använda AMD
 * för att dela upp koden och skapa ett test för varje AMD-modul.
 */
describe('ShoppingCart', function() {

  beforeEach(function() {
    // Mocka bort jQuery.ajax
    spyOn($, 'ajax').andCallFake(function (req) {
        var dfd = $.Deferred();
        dfd.resolve([{
          totalPrice: 1
        }]);
        
        return dfd.promise();
      });
  });

  /**
   * Tester för CartModel
   */
  describe('CartModel', function() {
    var sut ;

    beforeEach(function() {      
      spyOn(jQuery, 'publish').andCallThrough();

      sut = new ShoppingCart.CartModel();
    });

    it('is defined in global context', function() {
      expect(sut).toBeDefined();
    });

    it('handles fetch total price', function() {
      sut.fetchTotalPrice();
      
      expect(jQuery.ajax).toHaveBeenCalledWith({
        url: '/cart/total',
        method: 'POST'
      });
    });

    it('handles fetch total cart products', function() {
      sut.fetchCartProducts();
      
      expect(jQuery.ajax).toHaveBeenCalledWith({
        url: '/cart/summary',
        method: 'POST'
      });
    });

    it('handles fetch all', function() {
      sut.fetch();
      
      expect(jQuery.ajax).toHaveBeenCalled();
      expect(jQuery.publish).toHaveBeenCalledWith('/fetch');
    });

    it('should remove a product', function() {
      sut.remove(1);
     
      expect(jQuery.publish).toHaveBeenCalledWith('/message/remove', jasmine.any(String));
    });

    it('should store a product', function() {
      sut.store(1);
     
      expect(jQuery.publish).toHaveBeenCalledWith('/message/store', jasmine.any(String));
    });
  });

  /**
   * Tester för CartView
   */
  describe('CartView', function() {

    var sut,
        model;

    beforeEach(function() {  
      model = new ShoppingCart.CartModel();
      model.cartitems = [{ product: {} }];

      spyOn(jQuery, 'subscribe').andCallThrough();
      
      sut = new ShoppingCart.CartView(model);
    });

    it('subscribes to /fetch event', function() {
      new ShoppingCart.CartView(model);

      expect(jQuery.subscribe).toHaveBeenCalledWith(
        '/fetch', 
        jasmine.any(Object), 
        sut.render
      );
    });

    it('should empty the cart products on render', function() {
      spyOn(jQuery.fn, 'empty').andCallThrough();
      spyOn(jQuery.fn, 'html').andCallThrough();

      sut.render();

      expect(jQuery.fn.empty).toHaveBeenCalled();
      expect(jQuery.fn.html).toHaveBeenCalledWith(jasmine.any(String));
    });

  });
});