/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  // Capture the Device Pixel Ratio (DPR)
  const dpr = window.devicePixelRatio

  // Send the DPR to the service worker
  chrome.runtime.sendMessage({ type: 'dpr_update', dpr: dpr })

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
  let failedRequests = 0

  const formatBytes = (bytes) => {
    return (bytes / 1000).toFixed(2)
  }

  const showSummaryData = (id, value) => {
    if (id === 'data') return
    const displayValue = id === 'bytes' ? formatBytes(value) : value
    const element = document.getElementById(id)
    if (element) element.textContent = displayValue
  }

  const resetSection = (type) => {
    const element = document.querySelector(`#${type} dl`)
    if (element) {
      element.innerHTML = ''
      const aggregates = document.querySelectorAll(`#${type} div`)
      aggregates[0].textContent = `${type} count: 0`
      aggregates[1].textContent = `${type} kilobytes: 0`
    } else {
      console.warn(`${type} does not have a corresponding element`)
    }
  }

  const resetPanelDisplay = () => {
    Object.keys(elements.sections).forEach((type) => {
      resetSection(type)
    })
    requests.clear()
    requestCount = 0
    currentKey = ''
    failedRequests = 0

    document.querySelector('#failed-requests > div').innerText = ''
  }

  const populateSection = (type, requests) => {
    const section = elements.sections[type]
    if (!section) return

    const details = section.querySelector('details')
    const counter = section.querySelectorAll('div')[0]
    const bytes = section.querySelectorAll('div')[1]
    const dl = section.querySelector('dl') || document.createElement('dl')

    // Clear previous entries
    resetSection(type)

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
      dd_div1.textContent = formatBytes(request.bytes)
      dd_div2.textContent = formatBytes(request.uncompressedBytes)

      dd.append(dd_div1, dd_div2)
      dl.append(dt, dd)

      details.append(dl)
    })
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'url-changed' || message.action === 'url-reloaded') {
      resetPanelDisplay()
      if (message.url !== url) {
        url = message.url
      }
    }

    if (message.action === 'network-traffic') {
      // Show summary data
      if (message.data.status === 200) {
        Object.entries(message.data).forEach(([key, value]) =>
          showSummaryData(key, value)
        )

        // Show request details categories
        document.querySelector('.hidden')?.classList.remove('hidden')

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
              populateSection(type, value)
            }
          )
        } catch (error) {
          console.error('Error processing network traffic:', error)
        }

        // Hide visitor notification to reload the page
        elements.notification.style.display = 'none'
      } else {
        failedRequests++
        document.querySelector('#failed-requests > div').innerText =
          `There were ${failedRequests} failed requests.`
      }
    }
  })
})
