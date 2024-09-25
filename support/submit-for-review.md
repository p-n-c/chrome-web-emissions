# Sustainability report

## Store listing

## Title from package submission text

### Title from package

Page Validation

### Summary from package

CO2 emissions for current page

### Description

Sustainability report: summary of page size, hosting and emissions measured in mg/CO2.

### Category

Developer Tools

### Language

English (United Kingdom)

## Privacy

### Single purpose description

Calculate page greenhouse gas emissions

### activeTab justification

Justification: This permission is necessary to access and analyse the requests made on the currently active tab. It allows us to calculate CO2 emissions associated with the current tab.

### sidePanel justification

Justification: This permission is required to open and display the side panel where we show the calculated greenhouse gas emissions. Usage: The side panel is only opened when you click on the extension icon, giving you control over when to view the schema.

### webRequest justification

Justification: This permission enables us to add and remove listeners on individual requests (using chrome.webRequest.onCompleted) in the current tab.

Usage: Our scripts run only when you activate the extension on a specific page. They do not run in the background or on pages where you haven't initiated the extension.

### webNavigation justification (TBC)

Justification: This permission enables us to know when to start listening for requests (chrome.webNavigation.onBeforeNavigate) and when to stop and remove listeners (chrome.webNavigation.onCompleted) in the current tab.

Usage: Our scripts run only when you activate the extension on a specific page. They do not run in the background or on pages where you haven't initiated the extension.

### scripting justification

Justification: This permission enables us to inject and execute code run in a service worker and pass the results back to the side panel. These scripts are essential for intercepting page requests in order to find their size in kilobytes, calculating their CO2 emissions equivalent, and passing the results to the side panel via the background service-worker.js.

Usage: Our scripts run only when you activate the extension on a specific page. They do not run in the background or on pages where you haven't initiated the extension.

### tabs justification

Justification: This permission enables us to add listeners when the current tab page has loaded (chrome.tabs.onUpdated, "complete" status)and to remove them when the tab is removed (chrome.tabs.onRemoved).

Usage: The script runs only when a user activates the extension on a specific page. It does not run in the background or on pages where you haven't initiated the extension.

### Host permission justification

Justification: This permission enables us to inject and execute our content script into web pages. This script is essential for calculating emissions.

Usage: The script runs only when a user activates the extension on a specific page. It does not run in the background or on pages where you haven't initiated the extension.

### Are you using remote code?

No

### Data usage

None

### I certify that the following disclosures are true:

All 3 certified

### Privacy Policy

No Privacy policy
