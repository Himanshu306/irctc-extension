chrome.runtime.onInstalled.addListener(() => {
  console.log("IRCTC Form Renderer Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background script:', message);
  if (message.action === 'fillForm') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['content.js']
    }).then(() => {
      console.log('Content script injected successfully.');
    }).catch((error) => {
      console.error('Error injecting content script:', error);
    });
  }
});
