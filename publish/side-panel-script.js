/* eslint-disable no-undef */
const show = (id, value) => {
  document.getElementById(id).innerText = `${id}: ${value}`
}

document.addEventListener('DOMContentLoaded', () => {
  // Establish a connection to the service worker
  const port = chrome.runtime.connect({ name: 'panel-connection' })

  // Listen for url from the service worker
  port.onMessage.addListener((message) => {
    if (message.from === 'service-worker') {
      console.log('Current page url received from service worker:', message.url)

      // Display the url in the panel
      show('url', message.url)
    }
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'networkTraffic') {
      console.log('networkTraffic in side panel')
      console.log(message.result)

      for (const [key, value] of Object.entries(message.result)) {
        show(key, value)
      }
    }
  })
})
