/* eslint-disable no-undef */

import {
  getResponseDetails,
  saveNetworkTraffic,
  getNetworkTraffic,
  clearNetworkTraffic,
} from './emissions.js'

import { handleError, mapRequestTypeToType } from './utils.js'

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)

  if (tab && tab.active) {
    return tab
  } else {
    return null
  }
}

// Open the panel when the visitor clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id })
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
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

let webRequestListener = null

function handleWebRequest(details) {
  handleRequest(details)
}

function toggleWebRequestListener(isPanelVisible) {
  if (isPanelVisible && !webRequestListener) {
    // Enable (add) a new listener
    webRequestListener = handleWebRequest // Assign the function reference

    chrome.webRequest.onCompleted.addListener(webRequestListener, {
      urls: ['<all_urls>'],
    })
    console.log('Web request listener enabled (added)')
  } else if (!isPanelVisible && webRequestListener) {
    // Disable (remove) the listener
    chrome.webRequest.onCompleted.removeListener(webRequestListener)
    webRequestListener = null // Clear the reference
    console.log('Web request listener disabled (removed)')
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabs) => {
  if (changeInfo.url) {
    chrome.runtime.sendMessage({
      action: 'url-changed',
      url: changeInfo.url,
      tabId,
    })
    console.log('The URL changed')
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

// Device Pixel Ratio
let dpr

// We listen to changes in the side panel:
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'side-panel-dom-loaded') {
    dpr = message.dpr
  }
  if (message.type === 'panel-visibility') {
    // Enable (add), or disable (remove) the web request listener
    toggleWebRequestListener(message.isOpen)
  }
  if (message.type === 'reset-emissions') {
    clearNetworkTraffic()
  }
})

// When the visitor moves to a different, open tab, we clear the db
// And send a message to the side panel so that the display can be reset
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab switched. New active tab ID:', activeInfo.tabId)
  clearNetworkTraffic()

  // Fetch details of the new active tab
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log('New active tab URL:', tab.url)
    // Send message to side panel
    chrome.runtime.sendMessage({
      action: 'tab-switched',
    })
  })
})
