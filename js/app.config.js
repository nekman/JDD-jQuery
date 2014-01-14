require({
  paths: {
    reveal: './../reveal/js/reveal.min',
    hljs: './../reveal/plugin/highlight/highlight',
    notes: './../reveal/plugin/notes/notes',

    jquery: [
      '//code.jquery.com/jquery-1.10.2',
      './../jquery/dist/jquery' // fallback to local
    ]
  },

  shim: {
    notes: {
      exports: 'RevealNotes'
    },

    reveal: {
      deps: ['notes'],
      exports: 'Reveal'
    },

    hljs: {
      deps: ['reveal'],
      exports: 'hljs'      
    }
  }

}, ['app']);