define([
  'jquery',
  'hljs'
],
function($, hljs) {
  'use strict';

  var setupModule = {
    /* 
     * Remove spell checks by adding 
     * the "spellcheck" attribute to <code /> tags.
     */
    turnOffSpellcheck: function() {
      $('code').attr({
        spellcheck: false
      });
    },

    /* 
     * Find all <button class="runnable" /> and add click event 
     * that execute the <code/> block by assign it to a 'new Function' (NOTE: hack!)
     */
    setupRunnableButtons: function() {
      var handleClick = function($block) {
        return function executeBlock() {
          new Function($block.text())();            
        };
      };

      $('button.runnable').each(function() {
        var $this = $(this),
            $block = $this.prev().find('code');

        $this.on('click', handleClick($block));
      });
    },

    /*
     * Find all buttons with [data-reset-css="#some-selector"] - attribute,
     * register a click event that get the element by the provided selector,
     * empty the content and removes the style attribute. 
     */
    setupResetCssButtons: function() {
      $('button[data-reset-css]').on('click', function() {
        var selector = $(this).data('reset-css'),
            $el      = $(selector);

        $el.empty()
           .removeAttr('style');
      });
    },

    setupHighlight: function() {
      hljs.tabReplace = '  '; // 2 spaces
      hljs.initHighlighting();
    }
  };
  
  return {
    init: function() {
      $.each(setupModule, function(fn) {
        setupModule[fn]();
      });
    }
  };

});