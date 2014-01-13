define(function(require) {
  'use strict';

  var $            = require('jquery'),
      config       = require('app.reveal.config'),
      presentation = require('app.presentation');

  $(document).ready(presentation.init);
});

