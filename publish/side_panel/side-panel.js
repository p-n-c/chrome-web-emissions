/* eslint-disable no-undef */
const show = (id, value) => {
  const displayValue = id === 'bytes' ? value / 1000 : value
  document.getElementById(id).innerHTML = displayValue
}

document.addEventListener('DOMContentLoaded', () => {
  // Establish a connection to the service worker
  const port = chrome.runtime.connect({ name: 'panel-connection' })

  // Listen for url from the service worker
  port.onMessage.addListener((message) => {
    if (message.from === 'service-worker') {
      console.log('Current page url received from service worker:', message.url)
    }
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'networkTraffic') {
      console.log('networkTraffic in side panel')
      console.log(message.result)

      for (const [key, value] of Object.entries(message.result)) {
        show(key, value)
      }

      show('processing', 'Results updated')

      setTimeout(() => {
        show('processing', '')
      }, 3000)
    }
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'PageChange') {
      console.log('PageChange in side panel')
      console.log(message.url)
      console.log(message.tabId)

      // Display the url in the panel
      show('url', message.url)
      show('bytes', 0)
      show('count', 0)
      show('greenHosting', '')
      show('mgCO2', 0)
      show('processing', 'Processing page…')

      setTimeout(() => {
        show('processing', 'Still processing page…')
      }, 1000)
    }
  })
})
