// background.js

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureData') {
    // Example: Log captured data
    console.log(message.data);

    // You can send data to Google Sheets or process it further here
    // Example: Send data to a Google Sheet via Google Sheets API
    // See https://developer.chrome.com/docs/extensions/reference/runtime/
  }
});
