/**
 * NOTE: BAD EXAMPLE!!!
 * 
 * Pure spagetti... "get some elements, do something with them..."
 */
$(document).ready(function() {

  updateCart();

  function showTotalAmount() {
     $.ajax({
        url: '/cart/total',
        method: 'POST',
        success: function(data) {
          $('#total').html('Total: ' + data.totalPrice);
        }
      });
  }

  // Update cart
  function updateCart() {
    $.ajax({
      url: '/cart/summary',
      method: 'POST',
      success: function(items) {
        $('#cart table > tbody').empty();            
        $.each(items, function() {
          $('#cart table > tbody').append(
            $('<tr>')
              .append('<td>' + this.product.name + '</td>')
              .append('<td>' + this.qty + '</td>')
              .append('<td>' + this.linePrice + '$</td>')
              .append('<td><button data-id="' + this.product.id + '" class="remove btn">X</button></td>')
          );
        });

        showTotalAmount();

        $('button.remove').click(function() { 
          var productId = $(this).data('id');
          var $el = $(this);

          $.ajax({
            method: 'POST',
            url: '/cart/remove/' + productId,
            success: function(data) {
            
              $('#message').stop(true, true)
              $('#message').show()
              $('#message').removeClass('alert-success')
              $('#message').addClass('alert-info')
              $('#message').html('Tog bort 1st "' + data.product.name + '"')
              $('#message').fadeOut(3000);

              if (data.qty === 0) {
                $el.closest('tr').fadeOut(function() {
                  $(this).remove();                
                });
              }

              updateCart();
            }
          });
        });           
      },
      error: function(err) {
        $('#message').html('Något gick fel');    
      }
    });
  } 

  $('button.add').click(function() {
    var productId = $(this).data('id');

    $.ajax({
      url: '/cart/store/' + productId,
      method: 'post',      
      success: function(data) {
        $('#message').stop(true, true)
        $('#message').show()
        $('#message').addClass('alert-success')
        $('#message').removeClass('alert-info')
        $('#message').show().html('Lagt till "' + data.name + '"')
        $('#message').fadeOut(3000);
        
        updateCart();
      },
      error: function(err) {
        $('#message').html('Något gick fel');
      }
    });
  });
});