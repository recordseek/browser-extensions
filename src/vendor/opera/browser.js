(function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "opera"
    };

    app.newTab = function ($url) {
        chrome.extension.sendMessage({action: "newTab", url: $url, 'browser': app.browser.name});
    };

    app.getVersion = function () {
        return chrome.runtime.getManifest()['version'];
    }

    // Browser-Unique Functionality

    /* None */

})(window);

