// per new methods listed here
// https://developer.chrome.com/extensions/optionsV2

function update() {
    var hazChecked = document.getElementById( 'forgetUserSession' ).checked;
    chrome.storage.local.set(
        {
            RecordSeek: {forgetUserSession: hazChecked}
        }, function() {
            var display = document.getElementById( 'display' );
            display.innerHTML = "\u2713";
            chrome.runtime.sendMessage(
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
    document.getElementById( 'optionSession' ).innerHTML = chrome.i18n.getMessage( "optionSessionText" );
    document.getElementById( 'optionTitle' ).innerHTML = chrome.i18n.getMessage( "optionSessionTitle" );
    document.title = chrome.i18n.getMessage( "optionTitle" );

    chrome.storage.local.get(
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