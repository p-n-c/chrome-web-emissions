/* eslint-disable no-undef */

import {
  getResponseDetails,
  saveNetworkTraffic,
  getNetworkTraffic,
  clearNetworkTraffic,
} from './emissions.js'

import { handleError, mapRequestTypeToType } from './utils.js'

// Device Pixel Ratio
let dpr
let webRequestListener
let isSidePanelOpen = false

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)

  if (tab && tab.active) {
    return tab
  } else {
    return null
  }
}

const closeSidePanel = () => {
  chrome.runtime.sendMessage({
    action: 'close-side-panel',
  })
}

chrome.action.onClicked.addListener((tab) => {
  // Visitor clicks on the extension icon
  toggleWebRequestListener(!isSidePanelOpen)
  if (isSidePanelOpen) {
    closeSidePanel()
  } else {
    chrome.sidePanel.open({ windowId: tab.windowId })
  }
  // Toggle side panel visibility
  isSidePanelOpen = !isSidePanelOpen
})

// Update network traffic
function sendMessageToSidePanel(data) {
  chrome.sidePanel.getOptions({}, (options) => {
    if (options.enabled) {
      chrome.runtime.sendMessage({
        action: 'network-traffic',
        data,
      })
    } else {
      console.log('Side panel is not enabled')
    }
  })
}

// Handle network requests (triggered by page load)
const handleRequest = async (details) => {
  const activeTab = await getCurrentTab()

  const isActiveTab = activeTab?.id === details.tabId

  // Ensure it's a request associated with the current tab (page)
  if (isActiveTab) {
    const { url, initiator, method, type } = details

    // Implicitly exclude, for example, wss
    const permittedSchema = ['http:', 'https:']

    let response, scheme

    try {
      response = await fetch(url)
      scheme = new URL(response.url)?.protocol
    } catch (e) {
      handleError(e, 'handle request')
    }

    const resourceType = mapRequestTypeToType(type)

    if (permittedSchema.includes(scheme)) {
      const clonedResponse = response.clone()
      const responseDetails = await getResponseDetails(
        clonedResponse,
        'browser',
        type,
        resourceType,
        dpr
      )

      if (responseDetails) {
        const key = `${details.tabId}:${activeTab.url}`
        responseDetails.key = key

        // Save request details to the service worker application IndexedDB database
        await saveNetworkTraffic({
          ...responseDetails,
          method,
          type: responseDetails.resourceType,
        })

        const options = {
          hostingOptions: {
            verbose: true,
            forceGreen: true,
          },
        }

        // Retrieve processed request data
        const { bytes, count, greenHosting, mgCO2, emissions, data } =
          await getNetworkTraffic(key, initiator, options)

        sendMessageToSidePanel({
          url: activeTab.url,
          bytes,
          count,
          greenHosting,
          mgCO2,
          emissions,
          data,
          status: response.status,
          type,
        })
      } else {
        if (response.status !== 200) {
          sendMessageToSidePanel({
            url: response.url,
            bytes: 0,
            count: 0,
            greenHosting: false,
            mgCO2: 0,
            emissions: 0,
            data: null,
            status: response.status,
            type,
          })
        }
      }
    }
  }
}

function toggleWebRequestListener(isPanelVisible) {
  // If the side panel is open and we don't have a web request listener
  if (isPanelVisible && !webRequestListener) {
    // Enable (add) a new listener
    webRequestListener = handleRequest // Assign the function reference

    chrome.webRequest.onCompleted.addListener(webRequestListener, {
      urls: ['<all_urls>'],
    })
    console.log('Web request listener enabled (added)')
    // If the side panel is hidden and we already have a listener set up
  } else if (!isPanelVisible && webRequestListener) {
    // Disable (remove) the listener
    chrome.webRequest.onCompleted.removeListener(webRequestListener)
    webRequestListener = null // Clear the reference
    console.log('Web request listener disabled (removed)')
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabs) => {
  // Let the side panel know the url has changed or page refreshed
  // So that the side panel display can be reset
  if (changeInfo.url) {
    chrome.runtime.sendMessage({
      action: 'url-changed',
      url: changeInfo.url,
      tabId,
    })
    console.log('The URL changed')
    // If the visitor changes the URL in the current tab, clear the db
    clearNetworkTraffic()
  } else if (changeInfo?.status === 'loading') {
    chrome.runtime.sendMessage({
      action: 'url-reloaded',
      url: tabs.url,
      tabId,
    })
    console.log('The URL was reloaded (page refresh)')
  }
})

// We listen to changes in the side panel:
chrome.runtime.onMessage.addListener((message) => {
  // The side has been loaded
  if (message.type === 'side-panel-dom-loaded') {
    // dpr is a property of window which side panel has access to
    dpr = message.dpr
  }
  // The visitor wants to reset
  if (message.type === 'reset-emissions') {
    clearNetworkTraffic()
  }
})

// When the visitor moves to a different tab, we clear the db and close the side panel
chrome.tabs.onActivated.addListener(() => {
  // We stop listening for requests
  toggleWebRequestListener(false)
  // Clear the db
  clearNetworkTraffic()
  // Close the side panel
  closeSidePanel()
  // And set panel closed to true
  isSidePanelOpen = false
})
