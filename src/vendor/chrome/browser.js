(function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "chrome"
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

