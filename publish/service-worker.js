/* eslint-disable no-undef */

// Open the panel when the visitor clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
})

chrome.runtime.onConnect.addListener((port) => {
  console.log('Connected to panel')
  console.log(port)
  // Send a message to the panel via the port
  if (port.name === 'panel-connection') {
    port.postMessage({
      from: 'service-worker',
      message: 'Hello from the service worker',
    })
  }
})
;(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })
  const response = await chrome.tabs.sendMessage(tab.id, { url: tab.url })
  console.log(response)
})()
