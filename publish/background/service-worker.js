/* eslint-disable no-undef */

const emissions = () => {
  let urlsArray = {}
  let listeners = {}
  let pageUrl = ''
  let tabId = -1

  const processUrls = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let currentTab = tabs[0] // Get the active tab
      pageUrl = currentTab.url // Get the URL of the active tab
      tabId = currentTab.tab.id
      console.log('Current URL:', pageUrl)
    })

    if (urlsArray[tabId]?.length > 0) {
      console.log(`Processing ${urlsArray[tabId].length} URLs for tab ${tabId}`)

      // Capture the emissions
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: captureEmissions,
        args: [urlsArray[tabId]],
      })

      // Add artificial delay to allow time for requests to be processed
      const DELAY = 5000
      // Instruct the side panel to display emissions
      setTimeout(() => {
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
              console.log('Send network-traffic')
              chrome.runtime.sendMessage({
                action: 'network-traffic',
                result: { ...response[0].result, url: pageUrl },
              })
            }
          }
        )
      }, DELAY)
    } else {
      if (tabId) {
        console.log('No URLs to process for tab', tabId)
      }
    }
  }

  function setupListenerForTab(details) {
    const { tabId, url } = details

    // Set up a new listener
    listeners[tabId] = () => {
      if (!urlsArray[tabId]) urlsArray[tabId] = []
      if (!urlsArray[tabId].includes(details.url)) {
        urlsArray[tabId].push(details.url)
      }
    }

    // Add the new listener
    chrome.webRequest.onBeforeRequest.addListener(
      listeners[tabId],
      { urls: ['<all_urls>'], tabId },
      []
    )

    console.log('Listener set up for tab', tabId, ' for url: ', url)
  }

  // Use the webRequest API to capture all requests
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.tabId !== -1) {
        // Ensure the request comes from a valid tab
        setupListenerForTab(details)
      }
    },
    { urls: ['<all_urls>'] }
  )

  function removeListenerForTab(tabId) {
    if (listeners[tabId]) {
      chrome.webRequest.onBeforeRequest.removeListener(listeners[tabId])
      delete listeners[tabId]
      console.log('Listener removed for tab', tabId)
    }
  }

  chrome.tabs.onRemoved.addListener((tabId) => {
    removeListenerForTab(tabId)
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
      urlsArray[tabId] = []
      console.log('Send page-change')
      chrome.runtime.sendMessage({
        action: 'page-change',
        url: changeInfo.url,
        tabId,
      })
    }
  })

  return processUrls
}

;(function () {
  // Open the panel when the visitor clicks on the extension icon
  chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id })
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  })

  // Initialise the emissions function, including instantiating the request listeners
  const _processUrls = emissions()

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'DOMContentLoaded') {
      _processUrls()
    }
  })
})()

function captureEmissions(urls) {
  setMyPageEmissions(urls)
}

function showEmissions(pageUrl) {
  return getMyPageEmissions(pageUrl)
}
