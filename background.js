chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Action clicked", tab);
  // Perform an action, like sending a message to the current tab
});
