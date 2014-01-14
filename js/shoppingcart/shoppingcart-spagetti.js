/**
 * NOTE: BAD EXAMPLE!!!
 * 
 * Pure spagetti... "get some elements, do something with them..."
 */
$(document).ready(function() {

  // Anti pattern #1: All kod i $(document).ready !

  updateCart();

  function showTotalAmount() {
     $.ajax({
        url: '/cart/total',
        method: 'POST',
        // Anti pattern #2: Borde använt promise.done istället
        success: function(data) {
          // Anti pattern #3: $('#total') kunde ha cachats,
          // Nu hämtas den varje gång...
          $('#total').html('Total: ' + data.totalPrice);
        }
      });
  }

  // Update cart
  function updateCart() {
    $.ajax({
      url: '/cart/summary',
      method: 'POST',
      // Anti pattern #4: Borde använt promise.done istället
      success: function(items) {
        // Anti pattern #5: $('#cart table > tbody') kunde cachats.
        $('#cart table > tbody').empty();

        // Anti pattern #6: Append i loop.
        $.each(items, function() {
          // Anti pattern #7: $('#cart table > tbody') kunde cachats.
          $('#cart table > tbody').append(
            $('<tr>')
              .append('<td>' + this.product.name + '</td>')
              .append('<td>' + this.qty + '</td>')
              .append('<td>' + this.linePrice + '$</td>')
              .append('<td><button data-id="' + this.product.id + '" class="remove btn">X</button></td>')
          );
        });

        // Anti pattern #8
        showTotalAmount();

        // Anti pattern #9: $('button.remove') kunde cachats.
        // Anti pattern #10: 
        //      Istället för att fråga DOM-en efter button.remove,
        //      kunde 'on'-funktionen använts på följande sätt:
        //      $('#cart table').on('click', 'button.remove', handlerFn);
        $('button.remove').click(function() {

          // Anti pattern #11:
          /* Kunde undvikit dubbla 'var' och istället skrivit:
            var productId = ...,
                $el =
          */  
          var productId = $(this).data('id');
          var $el = $(this);

          // Anti pattern #12: anonyma metoder i anonyma metoder...
          $.ajax({
            method: 'POST',
            url: '/cart/remove/' + productId,
            // Anti pattern #13: promise...
            success: function(data) {

              // Anti pattern #15: Don't Repeat Yourself!!!
              $('#message').stop(true, true)
              $('#message').show()
              $('#message').removeClass('alert-success')
              $('#message').addClass('alert-info')
              $('#message').html('Tog bort 1st "' + data.product.name + '"')
              $('#message').fadeOut(3000);

              // Anti pattern #16: ...
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
        // Anti pattern #17: #message kunde ha cachats, dock ska detta
        // inte inträffa så ofta, så jag kan acceptera 
        // att man gör såhär.
        $('#message').html('Något gick fel');    
      }
    });
  } 

  // Anti pattern #18: ...
  $('button.add').click(function() {
    var productId = $(this).data('id');

    // Anti pattern #19: ...
    $.ajax({
      url: '/cart/store/' + productId,
      method: 'post',      
      success: function(data) {
        // Anti pattern #20: D.R.Y.
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