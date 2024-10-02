# Sustainability report

## Store listing

## Title from package submission text

### Title from package

Emissions tracker by People & Code

### Summary from package

Track emissions from page requests in real time.

### Description

This extension summarises data received, their associated carbon dioxide emissions, and whether or not the site is hosted renewably. A summary of requests is broken down by content type.

Emissions data are provided by The Green Web Foundation.

Emissions Tracker is part of a suite of free, open-source tools made by People & Code, a consultancy specialising in web accessibility and sustainability.

### Category

Developer Tools

### Language

English (United Kingdom)

## Privacy

### Single purpose description

Track emissions from page requests in real-time.

### activeTab justification

Justification: This permission is necessary to access and analyse the requests made on the currently active tab. It allows us to calculate CO2 emissions associated with the current tab.

### sidePanel justification

Justification: This permission is required to open and display the side panel where we show the calculated greenhouse gas emissions. Usage: The side panel is only opened when you click on the extension icon, giving you control over when to view the schema.

### scripting justification

Justification: This permission enables us to inject and execute code run in a service worker and pass the results back to the side panel. These scripts are essential for intercepting page requests in order to find their size in kilobytes, calculating their CO2 emissions equivalent, and passing the results to the side panel via the background service-worker.js.

Usage: Our scripts run only when you activate the extension on a specific page. They do not run in the background or on pages where you haven't initiated the extension.

### tabs justification

Justification: This permission enables us to add listeners when the current tab page has loaded (chrome.tabs.onUpdated, "complete" status)and to remove them when the tab is removed (chrome.tabs.onRemoved).

Usage: The script runs only when a user activates the extension on a specific page. It does not run in the background or on pages where you haven't initiated the extension.

### webRequest justification

Justification: This permission enables us to add and remove listeners on individual requests (using chrome.webRequest.onCompleted) in the current tab.

Usage: Our scripts run only when you activate the extension on a specific page. They do not run in the background or on pages where you haven't initiated the extension.

### storage justification

Justification: This permission is required to store request data prior to processing.

Usage: requests per page or domain are stored temporarily. They are deleted when the user visits a new site or reloads the current page (tab).

### Host permission justification

Justification: This permission enables us to inject and execute our content script into web pages. This script is essential for calculating emissions.

Usage: The script runs only when a user activates the extension on a specific page. It does not run in the background or on pages where you haven't initiated the extension.

### Are you using remote code?

No

### Data usage

None

### I certify that the following disclosures are true

All 3 certified

### Privacy Policy

No Privacy policy
