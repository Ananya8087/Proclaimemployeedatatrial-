// contentScript.js

// Function to extract data from each row
function extractRowData(row) {
  console.debug('Extracting data from row:', row);

  // Extract the case ID
  const caseIdElement = row.querySelector('div:nth-child(1) > div:nth-child(1)');
  const caseId = caseIdElement ? caseIdElement.textContent.trim() : 'N/A';
  console.debug('Case ID:', caseId);

  // Extract other data
  const otherData = {
    billNumber: row.querySelector('div:nth-child(2)').textContent.trim(),
    hospital: row.querySelector('div.text-truncate').textContent.trim(),
    duration: row.querySelector('div:nth-child(6)').textContent.trim()
    // Add more fields as needed
  };
  console.debug('Other Data:', otherData);

  return { caseId, ...otherData };
}

// Function to capture data of a specific row and store in local storage
function captureRowData(button) {
  const row = button.closest('.row-grid.summary-landing-widths.landing-grid--list');
  if (row) {
    console.log('Row identified for the clicked button:', row);
    const rowData = extractRowData(row);
    console.debug('Captured row data on button click:', rowData);
    
    // Send captured data to background script
    chrome.runtime.sendMessage({ action: 'captureData', data: rowData }, response => {
      console.debug('Message sent to background script. Response:', response);
    });

    // Store captured data in local storage
    chrome.storage.local.get('capturedRows', (result) => {
      const capturedRows = result.capturedRows || [];
      capturedRows.push(rowData);
      chrome.storage.local.set({ 'capturedRows': capturedRows }, () => {
        console.log('Row data saved to local storage:', rowData);
      });
    });
  } else {
    console.error('Row not found for the clicked button');
  }
}

// Function to add click detection to "Tabulate" buttons
function addClickDetection() {
  const container = document.querySelector('.summary--landing-list');
  if (!container) {
    console.error('Container not found for click detection');
    return;
  }

  const buttons = container.querySelectorAll('.btn.btn-primary.width-100px');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Clicked Tabulate button:', button);
      captureRowData(button);
    });
  });
}

// Function to continuously check for the container and rows every 3 seconds
function setupPatientDetailsButton() {
  setInterval(() => {
    const rowData = captureAllRowsData();
    if (rowData.length > 0) {
      // Send captured data to background script
      chrome.runtime.sendMessage({ action: 'captureData', data: rowData }, response => {
        console.debug('Message sent to background script. Response:', response);
      });
    }
    addClickDetection(); // Add click detection for buttons
  }, 3000);
}

// Function to capture all rows data within the specified container
function captureAllRowsData() {
  console.debug('Capturing all rows data...');

  const container = document.querySelector('.summary--landing-list');
  console.log("container", container);
  if (!container) {
    console.error('Container not found');
    return [];
  }

  const rows = container.querySelectorAll('.row-grid.summary-landing-widths.landing-grid--list');
  console.debug('Found rows:', rows.length, rows);
  if (rows.length > 0) {
    console.log("found", rows);
  } else {
    console.log("nothing");
  }

  const rowData = Array.from(rows).map(row => {
    try {
      return extractRowData(row);
    } catch (e) {
      console.error('Error extracting data from row:', row, e);
      return null;
    }
  }).filter(data => data !== null);

  console.debug('Captured row data:', rowData);
  return rowData;
}

// Start checking for the container and rows
setupPatientDetailsButton();
