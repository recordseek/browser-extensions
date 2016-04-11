(function(){

  var showDebug = false;

  var debug = function (str) {
    if (showDebug) {
      console.log(str);
    }
  };

  if (typeof safari === 'object') {

    debug('inject.js: listening for messages on safari.self ');

    safari.self.addEventListener("message", function (e) {
      debug('inject.js: message arrived: ' + e.name);

      switch(e.name) {

        case 'inject':
          debug('inject.js: injecting background js');
          debug(e.message);
          eval(e.message);
        break;

        case 'grid':
          if (window.top === window) {
            debug('inject.js: popping the grid');
            debug(e.message);
            eval(e.message);
          } else {
            debug('not popping the grid in an iframe');
          }
        break;

        default:
        break;
      };

    });

  } else {

    debug('inject.js: safari object not found. Perhaps we are in a sourceless iframe? ');

  }

}());

