import { browser } from '@danhartley/emissions'

/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  const getPageEmissions = (url) => {
    ;(async () => {
      await browser.registerServiceWorker()

      const options = {
        hostingOptions: {
          verbose: true,
          forceGreen: true,
        },
      }

      const { pageWeight, count, greenHosting, mgCO2 } =
        await browser.getPageEmissions(url, options)

      console.log(`Report for ${url}`)
      console.log('Page weight: ', `${pageWeight / 1000} Kbs`)
      console.log('Requests ', count)
      console.log('Emissions: ', `${mgCO2} mg of CO2`)
      console.log(
        greenHosting ? 'Hosting: green hosting' : 'Hosting: not green hosting'
      )

      await browser.clearPageEmissions()
    })()
  }

  // Establish a connection to the service worker
  const port = chrome.runtime.connect({ name: 'panel-connection' })

  // Listen for messages from the service worker
  port.onMessage.addListener((message) => {
    if (message.from === 'service-worker') {
      console.log('Message received from service worker:', message.message)

      // Display the message in the panel
      document.getElementById('message').innerText = message.message
    }
  })

  // Listen for runtime messages
  // chrome.runtime.onMessage.addListener(function (request) {
  //   const url = request.url
  //   getPageEmissions(url)
  // })
})
