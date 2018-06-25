function recordseek_toolbar_command(event) {
  if (event.command === "toolbarButtonCommand") {
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("RecordSeek", null);
  }
}

safari.application.activeBrowserWindow.addEventListener("command", recordseek_toolbar_command, false);

function recordseek_recieve_message(event) {
  if (event.name === "message" && event.message.action === "newTab") {
    safari.application.activeBrowserWindow.openTab().url = event.message.url;
  }
}

safari.application.activeBrowserWindow.addEventListener("message", recordseek_recieve_message, false);


//
// function recordseek_toolbar_command(event) {
//   if (event.command === "toolbarButtonCommand") {
//     safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("RecordSeek", null);
//   }
// }
//
// safari.application.activeBrowserWindow.addEventListener("command", recordseek_toolbar_command, false);
//
// function recordseek_receive_message(event) {
//   if (event.name === "message") {
//     if (event.message.action === "newTab") {
//       if (safari.extension.settings.forgetUserSession === true) {
//         event.message.url += "&newSession=1"
//       }
//       if (safari.extension.settings.openMode === "newTab") {
//         safari.application.activeBrowserWindow.openTab().url = event.message.url;
//       } else {
//         var win = safari.application.openBrowserWindow();
//         win.url = event.message.url;
//       }
//     }
//   } else {
//     console.log('Unknown message event');
//     console.log(event.message);
//   }
// }

safari.application.activeBrowserWindow.addEventListener("message", recordseek_receive_message, false);

// show the welcome popover
function makeAndShowPopover(popover, msg) {
  for (var i = 0; i < safari.extension.toolbarItems.length; i++) {
    safari.extension.toolbarItems[i].popover = popover;
    safari.extension.toolbarItems[i].showPopover();
  }
}
if (safari.extension.settings.hasBeenWelcomed === "0") {
  // safari.extension.settings.hasBeenWelcomed = 1;
  // makeAndShowPopover(safari.extension.createPopover("welcome2", safari.extension.baseURI + "html/welcome.html", 600, 180));
}