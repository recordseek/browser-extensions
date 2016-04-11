// log clicks to browser button with event=click&xm=g
  
(function (w, c, a) {
  var $ = w['P'] = {
    'w': w,
    'a': a,
    'c': c,
    'v': {
      'ver': c.runtime.getManifest().version,
      'sessionStart': new Date().getTime()
    },
    'f': (function () {
      return {
        debug: function (obj) {
          if (obj && $.v.debug) {
            console.log(obj);
          }
        },
        // send a request to a server
        xhr: function (url, callback) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true)
          if (callback) {
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                callback(xhr.responseText);
              }
            };
          }
          xhr.send();
        },
        // logging request
        log: function (str) {
          var url = $.a.endpoint.log + '?type=extension&xuid=' + $.v.xuid + '&xv=cr' + $.v.ver + str;
          $.f.debug('Logging: ' + url);
          $.f.xhr(url);
        },
        // set an object in local storage
        setLocal: function (obj) {
          for (var k in obj) {
            $.f.debug('setting local item: ' + k);
          }
          $.c.storage.local.set(obj);
        },
        // send something to content script
        send: function (obj) {
          $.c.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length) {
              $.f.debug('sending object to content script');
              $.f.debug(JSON.stringify(obj));
              $.c.tabs.sendMessage(tabs[0].id, obj, function() {});
            } else {
              $.f.debug('could not send; focused tab has no ID (developer console?)');
            }
          });
        },
        // various callbacks for xhr requests
        ping: {
          logic: function (txt) {
            if (txt) {
              $.f.setLocal({'logic': txt});
              $.f.debug('New business logic saved.');
            }
          },
          // parse and save hashList.json
          hash: function (r) {
            try {
              var parsed = JSON.parse(r);
              $.f.debug('hashList reply looks like JSON, checking lists');
              $.v.theList = parsed.theList;
              if ($.v.theList && $.v.theList.length) {
                $.f.debug('theList is present');
              } else {
                // don't wipe it if we already loaded a list
                if (!$.v.theList) {
                  $.v.theList = [];
                }
                $.f.debug('theList is NOT present');
              }
              $.v.theOtherList = parsed.theOtherList;
              if ($.v.theOtherList && $.v.theOtherList.length) {
                $.f.debug('theOtherList is present');
              } else {
                // don't wipe it if we already loaded a list
                if (!$.v.theOtherList) {
                  $.v.theOtherList = [];
                }
                $.f.debug('theOtherList is NOT present');
              }
              $.f.setLocal({
                'hashList': {
                  'timeStamp': $.v.sessionStart,
                  'theList': $.v.theList,
                  'theOtherList': $.v.theOtherList
                }
              });
            } catch (err) {
              $.f.debug('hashList reply does NOT look like JSON, aborting list check');
            }
          }
        },
        // pop the grid, usually when the toolbar button is clicked
        grid: function (extraGridParam) {
          $.f.debug('grid: started');
          var logMsg, pinmarklet;
          // base log message
          logMsg = '&event=click&xm=g';
          // start of JS
          pinmarklet = "(function(d){var e=d.createElement('script');";
          // extra param requested
          if (extraGridParam) {
            // add to JS
            pinmarklet = pinmarklet + "e.setAttribute('" + extraGridParam + "',true);";
            $.f.debug('grid: opening with extra parameter ' + extraGridParam);
            // add to logging message
            logMsg = logMsg + '&extraGridParam=' + extraGridParam;
          } else {
            $.f.debug('grid: opening');
          }
          pinmarklet = pinmarklet + "e.setAttribute('pinMethod','extension');e.setAttribute('xuid','" + $.v.xuid + "');e.setAttribute('extensionVer','cr" + $.v.ver + "');e.setAttribute('src','" + $.a.endpoint.assets + $.a.path.pinmarklet + "?r='+Math.random()*99999999);d.body.appendChild(e)}(document));";
          // run it
          $.c.tabs.executeScript(null, { code: pinmarklet });
          // so we know how long it's been since we last opened the grid
          $.f.setLocal({'lastGrid': new Date().getTime()});
          // log the click
          $.f.log(logMsg);
          $.f.debug('grid: finished');
        },
        // actions we are prepared to take when asked by content.js
        act: {
          // log something that happened in content
          logAction: function (request) {
            if (request.logAction) {
              $.f.log(request.logAction);
            }
          },
          // pop the grid -- r.extraParam may be used to add one boolean parameter to the call to pinmarklet.js
          popGrid: function (request) {
            $.f.debug('popGrid started');
            if (request.extraParam && typeof request.extraParam === 'string') {
              $.f.debug('popping grid with extra parameter ' + request.extraParam);
              $.f.grid(request.extraParam);
            } else {
              $.f.debug('popping grid');
              $.f.grid();
            }
            $.f.debug('popGrid finished');
          },
          // set uninstall URL
          uninstallUrl: function (request) {
            // open on uninstall
            var uninstallUrl = request.uninstallUrl + '?xuid=' + $.v.xuid + '&xv=cr' + $.v.ver;
            $.c.runtime.setUninstallURL(uninstallUrl);
            $.f.setLocal({'uninstallUrl': uninstallUrl});

            $.f.debug('setting uninstall URL to ' + uninstallUrl);
          },
          // bounce a message to content script
          bounceMsg: function (request) {
            $.f.send(request);
          }
        },
        // welcome, new user!
        welcome: function () {
          // create a note
          $.f.debug('Creating welcome note');
          $.c.notifications.create(
            'welcomeNote', {
            'type': 'basic',
              'iconUrl': 'icon_48.png',
              'title': $.c.i18n.getMessage("welcomeTitle"),
              'message': $.c.i18n.getMessage("welcomeBody")
            }, function () { }
          );
          // since we only have the one note, clicking any will open the welcome page
          $.c.notifications.onClicked.addListener(function () {
            $.f.debug('Welcome message clicked');
            window.open($.c.i18n.getMessage("welcomeLink"));
          });
          // open education page
          $.c.tabs.create({url: $.a.endpoint.about + $.a.path.welcome});
          // save timestamp in beenWelcomed
          $.f.setLocal({'beenWelcomed': $.v.sessionStart});
          $.f.act.uninstallUrl({'uninstallUrl': $.a.endpoint.about + $.a.path.uninstall});
       },
        // start a session
        init: function () {
          // set xuid if needed
          if (!$.v.xuid) {
            $.v.xuid = '';
            for (var i = 0; i < 12; i = i + 1) {
              $.v.xuid = $.v.xuid + $.a.digits.substr(Math.floor(Math.random() * 60), 1);
            }
            $.f.setLocal({'xuid': $.v.xuid});
            $.f.log('&event=install');
            $.f.welcome();
          } else {
            $.f.log('&event=session');
          }
          $.f.debug('xuid: ' + $.v.xuid);
          // update hash list 
          if (!$.v.hashList || !$.v.hashList.timeStamp || $.v.hashList.timeStamp < $.v.sessionStart - $.a.ttl.hashList) {
            $.f.xhr($.a.endpoint.assets + $.a.path.ext + $.a.path.hash + '?' + new Date().getTime(), $.f.ping.hash);
          }
          
          // path to logic may have been set in local storage
          if (!$.v.path) {
            $.v.path = $.a.endpoint.assets + $.a.path.ext + $.a.path.logic;
          }
           
          // get page logic for all session starts
          $.f.xhr($.v.path + '?' + new Date().getTime(), $.f.ping.logic);

          // fire pinmarklet on toolbar button click
          $.c.browserAction.onClicked.addListener(function(tab) {
            $.f.grid();
          });
          // create right-click-to-pin context menu
          // in try/catch because it occasionally tries to create itself
          // on bad pages
          $.c.contextMenus.removeAll();
          try {
            $.v.contextMenu = $.c.contextMenus.create({
              id: 'rightClickToPin',
              title: $.c.i18n.getMessage('menuAction'),
              // only fire for images
              contexts: ['image'],
              onclick: function(data) {
                // don't pin data: urls
                if (data.srcUrl.match(/^http/)) {
                  // check pinnability
                  $.c.tabs.executeScript(null, { code: $.a.contentGlobalRoot + '.f.rightClick("' + data.srcUrl + '");' });
                } else {
                  // warn not pinnable
                  $.c.tabs.executeScript(null, { code: $.a.contentGlobalRoot + '.f.warn();' });
                }
              }
            });
            $.f.debug('Context menu create success.');
          } catch (err) {
            $.f.debug('Context menu create FAIL.');
            $.f.debug(err);
          }
          
          // listen for incoming messages from content script
          $.c.runtime.onMessage.addListener(function(request) {
            for (var k in request) {
              if (typeof $.f.act[k] === 'function') {
                $.f.debug('Request arrived for $.f.act.' + k);
                $.f.debug(request);
                $.f.act[k](request);
                break;
              }
            }
          });
        }
      };
    }())
  };
  // get everything in local storage and then init
  $.c.storage.local.get(null, function(data) {
    for (var i in data) {
      $.v[i] = data[i];
    }
    $.f.init();
  });
}(window, chrome, {
  'contentGlobalRoot': 'EXT',
  'digits': '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz',
  'ttl': {
    'hashList': 60 * 60 * 24 * 1000
  },
  'endpoint': {
    'about': 'https://recordseek.com/',
    'log': 'https://recordseek.com/log/',
    'assets': 'https://assets.pinterest.com/'
  },
  'path': {
    'ext': 'ext/',
    'welcome': 'browser-button-confirmation-page/',
    'hash': 'hashList.json',
    'pinmarklet': 'js/pinmarklet.js',
    'logic': 'cr_139.js',
    'uninstall': 'browser-button/'
  }
}));

