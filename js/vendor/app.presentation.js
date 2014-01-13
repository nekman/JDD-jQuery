define(function(require) {
  'use strict';

  var $ = require('jquery'),

  handleClick = function($block) {
    return function() {
      new Function($block.text())();            
    };
  };

  /* 
   * Remove spell checks by adding 
   * the "spellcheck" attribute to <code /> tags.
   */
  $('code').attr({
    spellcheck: false
  });

  /* 
   * Find all <button class="runnable" /> and add click event 
   * that execute the <code/> block by assign it to a 'new Function' (NOTE: hack!)
   */
  $('button.runnable').each(function() {
    var $this = $(this),
        $block = $this.prev().find('code');

    $this.on('click', handleClick($block));
  });

  /*
   * Find all buttons with [data-reset-css="#some-selector"] - attribute,
   * register a click event that get the element by the provided selector,
   * empty the content and removes the style attribute. 
   */
  $('button[data-reset-css]').on('click', function() {
    var selector = $(this).data('reset-css'),
        $el      = $(selector);

    $el.empty()
       .removeAttr('style');
  });

  return $;
});