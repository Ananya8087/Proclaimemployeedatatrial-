// popup.js

// Example: Fetch captured data from storage and display in popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureData') {
    const capturedData = message.data;
    const capturedDataDiv = document.getElementById('capturedData');
    capturedDataDiv.textContent = JSON.stringify(capturedData, null, 2);
  }
});

// Example: Fetch captured data when popup is opened
chrome.runtime.sendMessage({ action: 'getCapturedData' });
