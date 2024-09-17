/* eslint-disable no-undef */

const emissions = () => {
  let urlsArray = {}
  let listeners = {}
  let pageUrl = ''

  for (let [key] of Object.entries(urlsArray)) {
    urlsArray[key] = []
  }

  const processUrls = (tabId) => {
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
              console.log('Show emissions data')
              console.log(response[0])
              chrome.runtime.sendMessage({
                action: 'networkTraffic',
                result: { ...response[0].result, url: pageUrl },
              })
            }
          }
        )
        // Prevent listeners from running on other tabs
        removeListenerForTab(tabId)
      }, DELAY)
    } else {
      if (tabId) {
        console.log('No URLs to process for tab', tabId)
      }
    }
  }

  function setupListenerForTab(details) {
    const { tabId, url } = details
    if (!listeners[tabId]) {
      listeners[tabId] = () => {
        if (!urlsArray[tabId]) urlsArray[tabId] = []
        urlsArray[tabId].push(url)
        pageUrl = url
      }
      chrome.webRequest.onCompleted.addListener(listeners[tabId], {
        urls: ['<all_urls>'],
      })
      console.log('Listener set up for tab', tabId, ' for url: ', url)
    }
  }

  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId === 0 && details.url !== 'about:blank') {
      console.log('onBeforeNavigate fired', details)
      setupListenerForTab(details)
    }
  })

  function removeListenerForTab(tabId) {
    if (listeners[tabId]) {
      chrome.webRequest.onCompleted.removeListener(listeners[tabId])
      delete listeners[tabId]
      console.log('Listener removed for tab', tabId)
    }
  }

  chrome.tabs.onRemoved.addListener((tabId) => {
    removeListenerForTab(tabId)
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
  const processUrls = emissions()

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'DOMContentLoaded') {
      processUrls(sender.tab.id)
    }
  })
})()

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log('Active tabId: ', tab.id)
    if (tab.url) {
      // Send a message to your side panel to update the data
      chrome.runtime.sendMessage({
        action: 'PageChange',
        url: tab.url,
        tabId: tab.id,
      })
      // Send a message to content_scripts to update the page
      // chrome.scripting.executeScript({
      //   target: { tabId: tab.id },
      //   function: reloadPage,
      //   args: [tab.url],
      // })
    }
  })
})

function captureEmissions(urls) {
  setMyPageEmissions(urls)
}

function showEmissions(pageUrl) {
  return getMyPageEmissions(pageUrl)
}

function reloadPage(pageUrl) {
  myReloadPage(pageUrl)
}
