(function (window) {
  var app = window.app = window.app || {};

  // Browser-Specific Implementations

  app.browser = {
    name: "safari"
  };

  app.newTab = function ($url) {
    safari.self.tab.dispatchMessage("message", {action: "newTab", url: $url, 'browser': app.browser.name});
  };

  app.getVersion = function () {
    var request = new XMLHttpRequest();
    request.open('GET', safari.extension.baseURI + "Info.plist", false);  // `false` makes the request synchronous
    request.send(null);
    return request.response.split('<key>CFBundleVersion</key>')[1].split('</string>')[0].split('<string>')[1];
  };

  app.setCookie = function (cname, cvalue, exMins) {
    var d = new Date();
    d.setTime(d.getTime() + (exMins * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

})(window);

function handleMessage(msgEvent) {
  if (msgEvent.name === "RecordSeek") {
    if (window == window.parent) {
      RecordSeek();
    }
  }
}

safari.self.addEventListener("message", handleMessage, false);
