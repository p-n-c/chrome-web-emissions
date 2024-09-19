/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'DOMContentLoaded') {
    let currentTab,
      url,
      tabId,
      pageKey,
      requests = {}

    // Find the current active tab, and set up listeners after tab is found
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        currentTab = tabs[0]
        url = currentTab.url
        tabId = currentTab.id
        pageKey = `${tabId}:${url}`
        requests[pageKey] = []

        // Capture requests for the current active tab
        const requestListener = (details) => {
          if (details.tabId !== -1 && details.tabId === tabId) {
            if (details.method === 'GET') {
              requests[pageKey].push(details.url)
              return { cancel: true }
            }
          }
        }

        // Add listener only after currentTab is set
        chrome.webRequest.onBeforeRequest.addListener(
          requestListener,
          {
            urls: ['<all_urls>'],
          },
          ['blocking']
        )

        // Function to stop listening for new requests
        const stopListening = () => {
          chrome.webRequest.onBeforeRequest.removeListener(requestListener)
          if (requests[pageKey]?.length > 0) {
            // Capture the emissions
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: captureEmissions,
              args: [requests[pageKey]],
            })
          }
          // Instruct the side panel to display emissions
          setTimeout(() => {
            chrome.scripting.executeScript(
              {
                target: { tabId },
                function: showEmissions,
                args: [url],
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError)
                } else if (response && response[0]) {
                  console.log('Send network-traffic')
                  chrome.runtime.sendMessage({
                    action: 'network-traffic',
                    result: { ...response[0].result, url },
                  })
                }
              }
            )
          }, 1000)
        }

        // Adjust the timeout based on your needs
        setTimeout(() => {
          stopListening()
        }, 5000)
      }
    })
  }
})

function captureEmissions(urls) {
  setMyPageEmissions(urls)
}

function showEmissions(pageUrl) {
  return getMyPageEmissions(pageUrl)
}
