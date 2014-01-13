/**
 * Modifierat exempel från Patterns föreläsningen.
 * Gjort det möjligt att skicka in "context".
 */
(function($) {

  var topics = {};

  $.publish = function(topicsName) {
    var args = Array.prototype.slice.call(arguments, 1);

    if (!topics[topicsName]) {
      return;
    }

    for (var i = 0; i < topics[topicsName].length; i++) {
      var topic = topics[topicsName][i];
      topic.callback.apply(topic.context, args);
    }
  },

  $.subscribe = function(topicsName, context, fn) {
    if (!topics[topicsName]) {
      topics[topicsName] = [];
    }

    topics[topicsName].push({
      context: context, 
      callback: fn
    });
  }

})(jQuery);