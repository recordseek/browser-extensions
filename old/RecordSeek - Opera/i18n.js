var i18n = new function () {
  var forEvery = function (attr, fn) {
    for_each(document.querySelectorAll('[' + attr + ']'), function (item) {
      fn(item.getAttribute(attr), item);
    });
  }

  this.get = function (value, placeholders) {
    return chrome.i18n.getMessage(value, placeholders);
  };

  this.initialize = function () {
    forEvery('i18n-content', function (value, item) {
      item.textContent = i18n.get(value);
    });

    forEvery('i18n-values', function (value, item) {
      for_each(value.split(';'), function (def) {
        def = def.split(':');
        var key = def[0];
        var value = i18n.get(def[1]);

        if (key.indexOf('.') === 0) {
          key = key.substring(1);
          item[key] = value;
        } else {
          item.setAttribute(key, value);
        }
      });
    });
  };
};
