// avoid polluting the global JavaScript namespace
(function (c, d) {
  // fail quietly if we can't access the Chrome or document objects we need
  if (c && d && d.body && d.URL) {
    // set a data attribute to body, indicating that the RecordSeek extension is installed.
    d.body.setAttribute('data-recordseek-extension-installed', 'cr' + c.runtime.getManifest().version);
    c.storage.local.get('logic', function(obj) {
      try {
        eval(obj.logic);
      } catch (err) {
        console.log(obj.logic);
        console.log(err);
      }
    });
    // if we're pinning, save the timestamp to lastPin
    if (d.URL.match(/^https?:\/\/(.*?)\.pinterest\.com\/pin\/create\/extension\//)) {
      c.storage.local.set({'lastPin': new Date().getTime()});
    }
  }
}(chrome, document));
