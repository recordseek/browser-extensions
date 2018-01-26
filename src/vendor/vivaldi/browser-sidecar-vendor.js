; (function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "vivaldi"
    };

    app.assets = {
        windowGrip: chrome.extension.getURL("img/grip.png"),
        highlighterCursor: chrome.extension.getURL("img/highlighter.png"),
        overlay: chrome.extension.getURL("html/overlay.html"),
        overlayOrigin: chrome.extension.getURL("html/overlay.html")
    };

    // Browser-Unique Functionality

    /* None */

})(window);



;(function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "vivaldi"
    };

    app.newTab = function ($url) {
        chrome.extension.sendMessage({action: "newTab", url: $url});
    };

    app.getVersion = function() {
        return chrome.runtime.getManifest()['version'];
    }

    // Browser-Unique Functionality

    /* None */

})(window);
