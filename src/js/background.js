if (typeof chrome == "undefined" || typeof chrome.runtime == "undefined") {
    if (typeof browser != "undefined") {
        chrome = browser;
    } else if (typeof safari != "undefined") {
        chrome = safari;
    }
}
if (typeof browser != "undefined")
    chrome.extension = browser.runtime;

chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.lastIndexOf("chrome://", 0) !== 0 &&
        tab.url.lastIndexOf("browser://", 0) !== 0 &&
        tab.url.lastIndexOf("opera://", 0) !== 0) {
        chrome.tabs.executeScript(null, {"code": "RecordSeek()"});
    }
});

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case 'newTab' : {
                chrome.storage.local.get(
                    {
                        RecordSeek: 'forgetUserSession'
                    }, function (items) {
                        if (items.RecordSeek.forgetUserSession === true) {
                            chrome.cookies.remove(
                                {
                                    "url": "https://recordseek.com/share/",
                                    "name": "FS_ACCESS_TOKEN_1"
                                }, function (deleted_cookie) {
                                }
                            );
                            chrome.cookies.remove(
                                {
                                    "url": "https://ident.familysearch.org/cis-web/oauth2/v3/authorization",
                                    "name": "fssessionid"
                                }, function (deleted_cookie) {
                                }
                            );
                        }
                        var w = 800;
                        var h = 680;
                        if (request.browser && request.browser == "opera") {
                            // Height fix for Opera
                            h = 690;
                        }
                        var left = (screen.width / 2) - (w / 2);
                        var top = (screen.height / 2) - (h / 2);

                        chrome.storage.local.set({'lastSource': new Date().getTime()});

                        chrome.windows.create({
                            'url': request.url,
                            'type': 'popup',
                            'width': w,
                            'height': h,
                            'left': left,
                            'top': top
                        }, function (window) {
                            if (!window) {
                                chrome.tabs.create({url: request.url});
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
    chrome.tabs.executeScript(tab.id, {"code": "RecordSeek()"});
}

chrome.contextMenus.create({
    title: "RecordSeek",
    contexts: ["all"],
    onclick: recordseekMenu,
});



