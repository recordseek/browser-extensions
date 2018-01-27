browser = (function () {
    if (typeof msBrowser !== "undefined")
        return msBrowser;
    if (typeof browser !== "undefined")
        return browser;
    return chrome;
})();

function update() {
    var hazChecked = document.getElementById( 'forgetUserSession' ).checked;
    browser.storage.local.set(
        {
            RecordSeek: {forgetUserSession: hazChecked}
        }, function() {
            var display = document.getElementById( 'display' );
            display.innerHTML = "\u2713";
            browser.runtime.sendMessage(
                {'logAction': '&event=preferences&forgetUserSession=' + hazChecked}, function() {
                }
            );
            setTimeout(
                function() {
                    display.innerHTML = '';
                }, 750
            );
        }
    );
}

function show() {

    document.getElementById( 'forgetUserSession' ).addEventListener( 'click', update );
    document.getElementById( 'optionSession' ).innerHTML = browser.i18n.getMessage( "optionSessionText" );
    document.getElementById( 'optionTitle' ).innerHTML = browser.i18n.getMessage( "optionSessionTitle" );
    document.title = browser.i18n.getMessage( "optionTitle" );

    browser.storage.local.get(
        {
            RecordSeek: 'forgetUserSession'
        }, function( items ) {
            if ( items.RecordSeek.forgetUserSession === true ) {
                document.getElementById( 'forgetUserSession' ).checked = items.RecordSeek.forgetUserSession;
            }
        }
    );
}

document.addEventListener( 'DOMContentLoaded', show );