browser = (function () {
    if (typeof msBrowser !== "undefined")
        return msBrowser;
    if (typeof browser !== "undefined")
        return browser;
    return chrome;
})();

(function (window) {
    var app = window.app = window.app || {};

    // Browser-Specific Implementations

    app.browser = {
        name: "vivaldi"
    };

    app.newTab = function ($url) {
        browser.runtime.sendMessage({action: "newTab", url: $url, 'browser': app.browser.name});
    };

    app.getVersion = function () {
        return browser.runtime.getManifest()['version'];
    }

    // Browser-Unique Functionality

    /* None */

})(window);