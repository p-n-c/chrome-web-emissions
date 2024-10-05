/* eslint-disable no-undef */

import { mapRequestTypeToType } from '../background/utils.js'
document.addEventListener('DOMContentLoaded', () => {
  // Capture the Device Pixel Ratio (DPR)
  const dpr = window.devicePixelRatio

  // Send the DPR to the service worker
  chrome.runtime.sendMessage({ type: 'dpr-update', dpr: dpr })

  const elements = {
    notification: document.getElementById('notification'),
    sections: {
      document: document.getElementById('document'),
      script: document.getElementById('script'),
      css: document.getElementById('css'),
      image: document.getElementById('image'),
      video: document.getElementById('video'),
      font: document.getElementById('font'),
      xhr: document.getElementById('xhr'),
      other: document.getElementById('other'),
    },
  }

  let url = ''
  let requests = new Set()
  let currentKey = ''
  let requestCount = 0
  let failedRequests = new Set()

  const failedRequestsSection = document.getElementById('failed-requests')

  const formatValue = (value) => {
    return isNaN(value) ? value : (value / 1000).toFixed(2)
  }

  const populateSummary = (id, value) => {
    if (id === 'data') return
    const displayValue =
      id === 'bytes' || id === 'mgCO2' ? formatValue(value) : value
    const element = document.getElementById(id)
    if (element) element.textContent = displayValue
  }

  const populateRequestsByType = (type, requests) => {
    const section = elements.sections[type]
    if (!section) return

    const details = section.querySelector('details')
    const counter = section.querySelectorAll('div')[0]
    const bytes = section.querySelectorAll('div')[1]
    const dl = section.querySelector('dl') || document.createElement('dl')

    // Clear previous entries
    resetRequestsByType(type)

    // Add total count and bytes per type
    counter.textContent = `${type} count: ${requests.length}`
    bytes.textContent = `${type} kilobytes: ${(requests.reduce((acc, curr) => acc + curr.bytes, 0) / 1000).toFixed(2)}`

    requests.forEach((request) => {
      if (currentKey !== request.key) {
        currentKey = request.key
      }

      const dt = document.createElement('dt')
      const dd = document.createElement('dd')
      const dd_div1 = document.createElement('div')
      const dd_div2 = document.createElement('div')

      // Add request url
      dt.textContent = request.url

      // Add bytes per request
      dd_div1.textContent = formatValue(request.bytes)
      dd_div2.textContent = formatValue(request.uncompressedBytes)

      dd.append(dd_div1, dd_div2)
      dl.append(dt, dd)

      details.append(dl)
    })
  }

  const populateFailedRequests = (url, type) => {
    // Convert request type to type
    const resourceType = mapRequestTypeToType(type)
    // Add the failed request url to the set
    failedRequests.add({ url, type: resourceType })

    // Show failed requests
    failedRequestsSection.classList.remove('hidden')

    // Text summary
    failedRequestsSection.querySelector('div').innerText =
      `There were ${failedRequests.size} failed requests.`

    // Get the list
    const ul = failedRequestsSection.querySelector('ul')

    // Clear the list
    ul.innerHTML = ''

    // We populate the list afresh each time to avoid duplicates
    failedRequests.forEach((fr) => {
      const li = document.createElement('li')
      li.innerText = `${fr.type}: ${fr.url}`
      ul.appendChild(li)
    })
  }

  const resetRequestsByType = (type) => {
    const dl = document.querySelector(`#${type} dl`)
    if (dl) {
      dl.innerHTML = ''
      const aggregates = document.querySelectorAll(`#${type} div`)
      aggregates[0].textContent = `${type} count: 0`
      aggregates[1].textContent = `${type} kilobytes: 0`
    } else {
      console.warn(`${type} does not have a corresponding element`)
    }
  }

  const resetPanelDisplay = () => {
    // Reset summary values
    ;['url', 'bytes', 'request-count', 'greenHosting', 'mgCO2'].forEach((id) =>
      populateSummary(id, '-')
    )

    // Reset request by type sections
    Object.keys(elements.sections).forEach((type) => {
      resetRequestsByType(type)
    })
    requests.clear()
    requestCount = 0
    currentKey = ''
    failedRequests.clear()

    // Reset failed requests
    failedRequestsSection.classList.add('hidden')
    failedRequestsSection.querySelector('div').innerText = ''
    failedRequestsSection.querySelector('ul').innerHTML = ''
  }

  // We need to reset the display in these 3 scenarios
  // The service worker db is cleared before any of these messages is sent
  chrome.runtime.onMessage.addListener((message) => {
    if (
      message.action === 'url-changed' ||
      message.action === 'url-reloaded' ||
      message.action === 'tab-switched'
    ) {
      resetPanelDisplay()
      if (message.url !== url) {
        url = message.url
      }
    }

    if (message.action === 'network-traffic') {
      // Update summary and requests
      if (message.data.status === 200) {
        Object.entries(message.data).forEach(([key, value]) =>
          populateSummary(key, value)
        )

        // Show request details categories
        document
          .querySelector('.hidden:not(#failed-requests)')
          ?.classList.remove('hidden')

        // Add counts from each type to the total
        requestCount = message.data.data.groupedByTypeBytes.reduce(
          (prevType, currType) => {
            return prevType + currType.count
          },
          0
        )

        // Update total request count
        document.getElementById('request-count').innerText = requestCount

        try {
          Object.entries(message.data.data.groupedByType).forEach(
            ([type, value]) => {
              populateRequestsByType(type, value)
            }
          )
        } catch (error) {
          console.error('Error processing network traffic:', error)
        }

        // Hide visitor notification to reload the page
        elements.notification.style.display = 'none'
      } else {
        // Update failed requests
        populateFailedRequests(message.data.url, message.data.type)
      }
    }
  })

  document
    .getElementById('reset-emissions-btn')
    .addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'reset-emissions' })
      resetPanelDisplay()
    })
})
