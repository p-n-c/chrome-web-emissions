/* eslint-disable no-undef */

// Listen for page to load
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DOMContentLoaded') {
    console.log(message)
  }

  let currentTab,
    url,
    tabId,
    pageKey,
    urls = {}

  // Find the current active tab, and create a unique key from its id and url
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      currentTab = tabs[0]
      url = currentTab.url
      tabId = currentTab.id
      pageKey = `${tabId}:${url}`
      urls[pageKey] = []
    }
  })

  // Capture requests for the current active tab
  const requestListener = (details) => {
    if (details.tabId !== -1 && details.tabId === tabId) {
      if (details.method === 'GET') {
        urls[pageKey].push(details.url)
      }
    }
  }

  chrome.webRequest.onBeforeRequest.addListener(requestListener, {
    urls: ['<all_urls>'],
  })

  // Function to stop listening for new requests
  const stopListening = () => {
    console.log(urls[pageKey])
    // chrome.webRequest.onBeforeRequest.removeListener(requestListener)
    // if (urls[pageKey].length > 0) {
    //   // Capture the emissions
    //   chrome.scripting.executeScript({
    //     target: { tabId: tabId },
    //     function: captureEmissions,
    //     args: [urls[pageKey]],
    //   })
    // }
  }

  // Example: Stop listening after 3 seconds
  setTimeout(stopListening, 3000)
})

function captureEmissions(urls) {
  setMyPageEmissions(urls)
}

function showEmissions(pageUrl) {
  return getMyPageEmissions(pageUrl)
}
