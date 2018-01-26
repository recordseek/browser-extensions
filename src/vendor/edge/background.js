browser.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.lastIndexOf("chrome://", 0) !== 0 &&
        tab.url.lastIndexOf("browser://", 0) !== 0 &&
        tab.url.lastIndexOf("opera://", 0) !== 0) {
        browser.tabs.executeScript(tab.id, {"code": "RecordSeek()"});
    }
});

browser.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case 'newTab' : {
                browser.storage.local.get(
                    {
                        RecordSeek: 'forgetUserSession'
                    }, function (items) {
                        if (items.RecordSeek.forgetUserSession === true) {
                            browser.cookies.remove(
                                {
                                    "url": "https://recordseek.com/share/",
                                    "name": "FS_ACCESS_TOKEN_1"
                                }, function (deleted_cookie) {
                                }
                            );
                            browser.cookies.remove(
                                {
                                    "url": "https://ident.familysearch.org/cis-web/oauth2/v3/authorization",
                                    "name": "fssessionid"
                                }, function (deleted_cookie) {
                                }
                            );
                        }
                        var w = 800;
                        var h = 650;
                        var left = (screen.width / 2) - (w / 2);
                        var top = (screen.height / 2) - (h / 2);

                        browser.storage.local.set( {'lastSource': new Date().getTime()} );

                        browser.windows.create({
                            'url': request.url,
                            'type': 'popup',
                            'width': w,
                            'height': h,
                            'left': left,
                            'top': top
                        }, function (window) {
                            if (!window) {
                                browser.tabs.create({url: request.url});
                            }
                        });
                    }
                );
            }
                break;
        }
    }
);

function recordseekMenu(info, tab) {
    browser.tabs.executeScript(tab.id, {"code": "RecordSeek()"});
}

browser.contextMenus.create({
    title: "RecordSeek",
    contexts: ["all"],
    onclick: recordseekMenu,
});



