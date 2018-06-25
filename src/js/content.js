var enable_debug = true;

Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
}

function find_tags(b) {
  var h = document.getElementsByTagName('*'), c;
  for (c in h) if (-1 < (' ' + h[c].className + ' ').indexOf(' ' + b + ' ')) return h[c]
}

function debug(msg) {
  var console = (window.console = window.console || {});
  if (enable_debug === true) {
    console.log(msg);
  }
}

function find_meta(c) {
  var b = document.getElementsByTagName('meta');
  for (var i = 0; i < b.length; i++) if (b[i].getAttribute('property') == c) return b[i].getAttribute('content');
  return !1
}

function open_tab(newData) {
  debug(newData);
  var url = "";
  for (var prop in newData) {
    if (newData.hasOwnProperty(prop)) {
      if (!newData[prop]) {
        continue;
      }
      if (url != "") {
        url += "&"
      }
      url += prop + "=" + encodeURIComponent(newData[prop])
    }
  }
  url = "https://recordseek.com/share/?" + url;
  app.newTab(url);
}

function RecordSeek() {
  var k = 'https:' == document.location.protocol ? 'https://' : 'http://', b = '';
  find_tags('citation') && (b = find_tags('citation').getElementsByTagName('p'), 0 < b.length && (b = b[0].textContent || b[0].innerText));
  var c = document.getElementsByTagName('h1'), d = '';
  0 < c.length && (d = c[0].textContent || c[0].innerText);
  c = document.title;
  d && d.length > document.title.length && (c = d);
  var e = '' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);
  '' == e && find_meta('description') ? e = find_meta('description') : '' == e && find_meta('og:description') && (e = find_meta('og:description'));

  c = document.title;
  d && d.length > document.title.length && (c = d);

  var newData = {
    '_': (new Date).getTime(),
    'url': window.location.href,
    'h1': d,
    'citation': b,
    'title': c,
    'notes': ('' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text)).replace(/(\r\n|\n|\r)/gm, " "),
    'e': app.browser.name,
    'ev': app.getVersion()
  };

  genscrape().on('data', function (data) {
    try {
      debug(data);
      newData['title'] = data.sourceDescriptions[0].titles[0].value;
      newData['citation'] = data.sourceDescriptions[0].citations[0].value;
      newData['url'] = data.sourceDescriptions[0].about;
      newData['tags'] = [];
      for (var i = 0; i < data.persons[0].facts.length; i++) {
        if (newData['tags'].indexOf(data.persons[0].facts[i].type > -1)) {
          var fact_type = data.persons[0].facts[i].type.split("http://gedcomx.org/")[1];
          if (newData['tags'].indexOf(fact_type) == -1) {
            newData['tags'].push(fact_type);
          }
        }
      }
      newData['tags'] = newData['tags'].join();
    } catch (err) {
    }
    debug('genscrapeData');
    open_tab(newData);
  }).on('noMatch', function () {
    debug('noMatch');
    open_tab(newData);
  }).on('noData', function () {
    debug('noData');
    open_tab(newData);
  }).on('error', function () {
    debug('error');
    open_tab(newData);
  });
}

function url_matching_actions() {
  if (document.URL.indexOf("recordseek.com") >= 0) {
    document.body.setAttribute('extension', app.browser.name);
    document.body.setAttribute('version', app.getVersion());
  }

  /*
    if (document.URL.indexOf("recordseek.com/share/") >= 0) {
      alert('check the cookie');
      app.setCookie('FS_ACCESS_TOKEN_1','',0)
      app.setCookie('recordseek-auth','',0)
    }
    if (document.URL.indexOf("ident.familysearch.org/cis-web/oauth2/v3/authorization") >= 0) {
      app.setCookie('fssessionid','',0)
    }
  */
}

// Works for Safari AND Chrome, loading order stuff.
if (document && document.body && document.URL && (document.readyState === "complete"
    || document.readyState === "loaded"
    || document.readyState === "interactive")) {
  url_matching_actions();
} else {
  window.addEventListener('DOMContentLoaded', function () {
    if (document) {
      url_matching_actions();
    }
  }, true);
}
