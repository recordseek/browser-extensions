// per new methods listed here
// https://developer.chrome.com/extensions/optionsV2

function update() {
  var hazChecked = document.getElementById('hideHoverButtons').checked;
  chrome.storage.local.set({
    hideHoverButtons: hazChecked
  }, function() {
    var display = document.getElementById('display');
    display.innerHTML = "\u2713";
    chrome.runtime.sendMessage({'logAction': '&event=preferences&hideHoverButtons=' + hazChecked}, function() {});
    setTimeout(function() {
      display.innerHTML = '';
    }, 750);
  });
}

function show() {
  document.getElementById('hideHoverButtons').addEventListener('click', update);
  document.getElementById('optionHide').innerHTML = chrome.i18n.getMessage("optionHide");
  document.getElementById('optionTitle').innerHTML = chrome.i18n.getMessage("optionTitle");
  document.title = chrome.i18n.getMessage("optionTitle");
  chrome.storage.local.get({
    hideHoverButtons: 'hideHoverButtons'
  }, function(items) {
    if (items.hideHoverButtons === true) {
      document.getElementById('hideHoverButtons').checked = items.hideHoverButtons;
    }
  });
}

document.addEventListener('DOMContentLoaded', show);
    

