// log clicks to browser button with event=click&xm=g

(function( w, c, a ) {
    var $ = w['recordseek'] = {
        'w': w,
        'a': a,
        'c': c,
        'v': {
            'ver': c.runtime.getManifest().version,
            'sessionStart': new Date().getTime(),
            //'debug': true,
        },
        'f': (function() {
            return {
                debug: function( obj ) {
                    if ( obj && $.v.debug ) {
                        console.log( obj );
                    }
                },
                // send a request to a server
                xhr: function( url, callback ) {
                    var xhr = new XMLHttpRequest();
                    xhr.open( "GET", url, true )
                    if ( callback ) {
                        xhr.onreadystatechange = function() {
                            if ( xhr.readyState == 4 ) {
                                callback( xhr.responseText );
                            }
                        };
                    }
                    xhr.send();
                },
                // logging request
                log: function( str ) {
                    var url = $.a.endpoint.log + '?type=extension&xuid=' + $.v.xuid + '&xv=cr' + $.v.ver + str;
                    $.f.debug( 'Logging: ' + url );
                    $.f.xhr( url );
                },
                // set an object in local storage
                setLocal: function( obj ) {
                    for ( var k in obj ) {
                        $.f.debug( 'setting local item: ' + k );
                    }
                    $.c.storage.local.set( obj );
                },
                // send something to content script
                send: function( obj ) {
                    $.c.tabs.query(
                        {active: true, currentWindow: true}, function( tabs ) {
                            if ( tabs.length ) {
                                $.f.debug( 'sending object to content script' );
                                $.f.debug( JSON.stringify( obj ) );
                                $.c.tabs.sendMessage(
                                    tabs[0].id, obj, function() {
                                    }
                                );
                            } else {
                                $.f.debug( 'could not send; focused tab has no ID (developer console?)' );
                            }
                        }
                    );
                },
                // pop the launch, usually when the toolbar button is clicked
                launch: function( extraGridParam ) {
                    // If set, delete the RecordSeek FS session at each page load
                    chrome.storage.local.get(
                        {
                            RecordSeek: 'forgetUserSession'
                        }, function( items ) {
                            if ( items.RecordSeek.forgetUserSession === true ) {
                                chrome.cookies.remove(
                                    {
                                        "url": "https://recordseek.com/share/",
                                        "name": "FS_ACCESS_TOKEN_1"
                                    }, function( deleted_cookie ) {
                                    }
                                );
                            }
                        }
                    );

                    $.f.debug( 'launch: started' );
                    var logMsg, bookmarklet;
                    // base log message
                    logMsg = '&event=click&xm=g';
                    // start of JS
                    bookmarklet = "(function(d){var e=d.createElement('meta');";
                    // extra param requested
                    if ( extraGridParam ) {
                        // add to JS
                        bookmarklet = bookmarklet + "e.setAttribute('" + extraGridParam + "',true);";
                        $.f.debug( 'launch: opening with extra parameter ' + extraGridParam );
                        // add to logging message
                        logMsg = logMsg + '&extraGridParam=' + extraGridParam;
                    } else {
                        $.f.debug( 'launch: opening' );
                    }
                    bookmarklet = bookmarklet + "e.setAttribute('id','recordseek');e.setAttribute('method','extension');e.setAttribute('xuid','" + $.v.xuid + "');e.setAttribute('version','cr" + $.v.ver + "');d.head.appendChild(e)}(document));";
                    // run it
                    $.c.tabs.executeScript( {code: bookmarklet} );
                    $.c.tabs.executeScript( {file: "bookmarklet.js"} );

                    // so we know how long it's been since we last opened the launch
                    $.f.setLocal( {'lastSource': new Date().getTime()} );
                    // log the click
                    //$.f.log( logMsg );
                    $.f.debug( 'launch: finished' );
                },
                // actions we are prepared to take when asked by content.js
                act: {
                    // log something that happened in content
                    logAction: function( request ) {
                        if ( request.logAction ) {
                            $.f.log( request.logAction );
                        }
                    },
                    // set uninstall URL
                    uninstallUrl: function( request ) {
                        // open on uninstall
                        var uninstallUrl = request.uninstallUrl + '?xuid=' + $.v.xuid + '&xv=cr' + $.v.ver;
                        $.c.runtime.setUninstallURL( uninstallUrl );
                        $.f.setLocal( {'uninstallUrl': uninstallUrl} );

                        $.f.debug( 'setting uninstall URL to ' + uninstallUrl );
                    },
                },
                // welcome, new user!
                welcome: function() {
                    // create a note
                    $.f.debug( 'Creating welcome note' );
                    $.c.notifications.create(
                        'welcomeNote', {
                            'type': 'basic',
                            'iconUrl': 'icon_48.png',
                            'title': $.c.i18n.getMessage( "welcomeTitle" ),
                            'message': $.c.i18n.getMessage( "welcomeBody" )
                        }, function() {
                        }
                    );
                    // since we only have the one note, clicking any will open the welcome page
                    $.c.notifications.onClicked.addListener(
                        function() {
                            $.f.debug( 'Welcome message clicked' );
                            window.open( $.c.i18n.getMessage( "welcomeLink" ) );
                        }
                    );
                    // open education page
                    //$.c.tabs.create( {url: $.a.endpoint.about + $.a.path.welcome} );
                    // save timestamp in beenWelcomed
                    $.f.setLocal( {'beenWelcomed': $.v.sessionStart} );
                    $.f.act.uninstallUrl( {'uninstallUrl': $.c.i18n.getMessage( "uninstallLink" )} );
                },
                // start a session
                init: function() {
                    // set xuid if needed
                    if ( !$.v.xuid ) {
                        $.v.xuid = '';
                        for ( var i = 0; i < 12; i = i + 1 ) {
                            $.v.xuid = $.v.xuid + $.a.digits.substr( Math.floor( Math.random() * 60 ), 1 );
                        }
                        $.f.setLocal( {'xuid': $.v.xuid} );
                        $.f.log( '&event=install' );
                        $.f.welcome();
                    } else {
                        $.f.log( '&event=session' );
                    }
                    $.f.debug( 'xuid: ' + $.v.xuid );

                    // fire bookmarklet on toolbar button click
                    $.c.browserAction.onClicked.addListener(
                        function( tab ) {
                            $.f.launch();
                        }
                    );
                    // create right-click-to-pin context menu
                    // in try/catch because it occasionally tries to create itself
                    // on bad pages
                    try {
                        $.v.contextMenu = chrome.contextMenus.create(
                            {
                                id: 'rightClickToCite',
                                "title": $.c.i18n.getMessage( 'menuAction' ),
                                "contexts": ["page", "frame", "editable", "image", "video", "audio", "link", "selection"],
                                onclick: function( data ) {
                                    $.f.launch();
                                }

                            }
                        );
                        $.f.debug( 'Context menu create success.' );
                    } catch ( err ) {
                        $.f.debug( 'Context menu create FAIL.' );
                        $.f.debug( err );
                    }

                    // listen for incoming messages from content script
                    $.c.runtime.onMessage.addListener(
                        function( request ) {
                            for ( var k in request ) {
                                if ( typeof $.f.act[k] === 'function' ) {
                                    $.f.debug( 'Request arrived for $.f.act.' + k );
                                    $.f.debug( request );
                                    $.f.act[k]( request );
                                    break;
                                }
                            }
                        }
                    );
                }
            };
        }())
    };
    // get everything in local storage and then init
    $.c.storage.local.get(
        null, function( data ) {
            for ( var i in data ) {
                $.v[i] = data[i];
            }
            $.f.init();
        }
    );
}(
    window, chrome, {
        'contentGlobalRoot': 'recordseek',
        'digits': '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz',
        'endpoint': {
            'about': 'https://recordseek.com/',
            'log': 'https://recordseek.com/log/',
        },
        'path': {
            'ext': 'ext/',
            'welcome': 'success/',
            'uninstall': 'uninstall/'
        }
    }
));

