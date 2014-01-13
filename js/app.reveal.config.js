define([
  'reveal', 
  'jquery'
], 
function(Reveal, $) {
  'use strict';

  // https://github.com/hakimel/reveal.js#configuration    
  Reveal.initialize({
    width: 1024,
    controls: true,
    progress: true,
    history: true,
    center: true,
    transition: 'linear'
  });

  Reveal.addEventListener('fragmentshown', function(e) {
    var $fragment = $(e.fragment);
    if ($fragment.hasClass('js')) {
      $fragment.closest('section')
               .find('.fragment:not(:last)')
               .addClass('strikethrough');
    }
  });
  
  return Reveal;
});