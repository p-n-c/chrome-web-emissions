/* eslint-disable no-undef */

// Open the panel when the visitor clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  console.log('tab: ', tab)
})
;(function () {
  console.log('Background script initialized')
  let urlsArray = []
  let listeners = {}
  let pageUrl = ''

  function processUrls(tabId) {
    console.log('Processing URLs for tab', tabId)
    if (urlsArray.length > 0) {
      console.log('URLs to process:', urlsArray)

      // Capture the emissions
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: captureEmissions,
        args: [urlsArray],
      })

      // Fetch the emissions
      console.log('Fetch the emissions')
      console.log('tabId: ', tabId)
      console.log('pageUrl: ', pageUrl)
      chrome.scripting.executeScript(
        {
          target: { tabId },
          function: showEmissions,
          args: [pageUrl],
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError)
          } else if (response && response[0]) {
            console.log('Show emissions data')
            console.log(response[0])

            chrome.runtime.sendMessage({
              action: 'networkTraffic',
              result: response[0].result,
            })
          }
        }
      )
    } else {
      console.log('No URLs to process for tab', tabId)
    }
  }

  function setupListenerForTab(details) {
    const { tabId, url } = details
    console.log('Setting up listener for tab', tabId)
    if (!listeners[tabId]) {
      listeners[tabId] = (details) => {
        console.log('Captured URL:', details.url)
        console.log('details: ', details)
        console.log('tabId: ', tabId)
        urlsArray.push(details.url)
        pageUrl = url
      }
      chrome.webRequest.onCompleted.addListener(listeners[tabId], {
        urls: ['<all_urls>'],
      })
      console.log('Listener set up for tab', tabId)
    }
  }

  function removeListenerForTab(tabId) {
    console.log('Removing listener for tab', tabId)
    if (listeners[tabId]) {
      chrome.webRequest.onCompleted.removeListener(listeners[tabId])
      delete listeners[tabId]
      console.log('Listener removed for tab', tabId)
    }
  }

  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    console.log('onBeforeNavigate fired', details)
    if (details.frameId === 0) {
      console.log('Setting up listener for tab', details.tabId)
      setupListenerForTab(details)
    }
  })

  chrome.webNavigation.onCompleted.addListener((details) => {
    console.log('onCompleted fired', details)
    // Main frame only
    if (details.frameId === 0) {
      console.log('Processing URLs for tab', details.tabId)
      processUrls(details.tabId)
      removeListenerForTab(details.tabId)
    }
  })

  chrome.tabs.onRemoved.addListener((tabId) => {
    processUrls(tabId)
    removeListenerForTab(tabId)
  })
})()

chrome.runtime.onConnect.addListener(async (port) => {
  console.log('Connected to panel')

  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  // Send the url of the current tab to the panel via the port
  if (port.name === 'panel-connection') {
    port.postMessage({
      from: 'service-worker',
      url: tab.url,
    })
  }
})

function captureEmissions(urls) {
  setMyPageEmissions(urls)
}

function showEmissions(pageUrl) {
  return getMyPageEmissions(pageUrl)
}
