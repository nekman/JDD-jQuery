/**
 * Modifierat exempel från JDD-patterns föreläsningen.
 *
 * > Utökar jQuery med metoderna jQuery.subscribe / jQuery.publish.
 * > Ändrat  "topics" till private scope.
 * > Gör det möjligt att skicka in "context" som ett argument.
 *   Kunde tidigare göras genom att anropa med "bind" eller med (typ):
 * 
 *   $.proxy($.subscribe('/example', callback), this);
 */
(function($) {
  'use strict';

  // private
  var topics = {};

  $.publish = function(topicsName) {
    var args = Array.prototype.slice.call(arguments, 1),
        subscribers = topics[topicsName];

    if (!subscribers) {
      return;
    }

    $.each(subscribers, function() {
      this.fn.apply(this.context, args);
    });
  };

  $.subscribe = function(topicsName, context, callback) {
    if (!topics[topicsName]) {
      topics[topicsName] = [];
    }

    topics[topicsName].push({
      context: context, 
      fn: callback
    });
  };

})(jQuery);