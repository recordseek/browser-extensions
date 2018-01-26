;(function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "edge"
    };

    app.newTab = function ($url) {
        browser.extension.sendMessage({action: "newTab", url: $url});
    };

    app.getVersion = function() {
        return browser.runtime.getManifest()['version'];
    }

    // Browser-Unique Functionality

    /* None */

})(window);