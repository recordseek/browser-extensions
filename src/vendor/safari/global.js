safari.application.addEventListener("command", function (event) {
    if (event.command === "toolbarButtonCommand") {
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("RecordSeek", null);
    }
}, false);