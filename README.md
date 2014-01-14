JDD jQuery
=========

Presentation om [jQuery] för Jönköping Developer Dojo. Förutom [jQuery] har andra bibliotek använts för att förenkla visningen.

* [Reveal.js] - Presentation
* [Highlight.js] - Code highlight
* [Jasmine]  - Test
* [Require.js]  - För att det är ett måste! :)


Backenden är en enkel [Node.js] - [express] - applikation för att kunna köra ajax-requests samt även visa och köra "ShoppingCart"-exemplet.

Köra lokalt
--------------
```sh
git clone https://github.com/nekman/JDD-jQuery
npm install

node server/app.js
```

Presentationen finns på http://jdd.azurewebsites.net

[reveal.js]:http://lab.hakim.se/reveal-js/
[jQuery]:http://jquery.com
[Highlight.js]: http://highlightjs.org/
[Jasmine]: http://pivotal.github.io/jasmine/
[node.js]:http://nodejs.org
[express]:http://expressjs.com
[Require.js]:http://requirejs.org