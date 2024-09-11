/* eslint-disable no-undef */

// Open the panel when the visitor clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  console.log('tab: ', tab)
})

chrome.runtime.onConnect.addListener(async (port) => {
  console.log('Connected to panel')

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  // Send a message to the panel via the port
  if (port.name === 'panel-connection') {
    port.postMessage({
      from: 'service-worker',
      url: tab.url,
    })
  }
})
