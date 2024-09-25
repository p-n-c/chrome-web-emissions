/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    notification: document.getElementById('notification'),
    sections: {
      document: document.getElementById('document'),
      script: document.getElementById('script'),
      css: document.getElementById('css'),
      image: document.getElementById('image'),
      video: document.getElementById('video'),
      font: document.getElementById('font'),
      other: document.getElementById('other'),
    },
  }

  let requests = new Set()
  let currentKey = ''
  let counts = Object.fromEntries(
    Object.keys(elements.sections).map((key) => [key, 0])
  )
  let typeBytes = Object.fromEntries(
    Object.keys(elements.sections).map((key) => [key, 0])
  )

  const showSummaryData = (id, value) => {
    if (id === 'data') return
    const displayValue = id === 'bytes' ? (value / 1000).toFixed(2) : value
    const element = document.getElementById(id)
    if (element) element.textContent = displayValue
  }

  const clearSection = (selector) => {
    const element = document.querySelector(selector)
    if (element) element.innerHTML = ''
    else console.warn(`${selector} does not have a corresponding element`)
  }

  const resetPanelDisplay = () => {
    Object.keys(elements.sections).forEach((section) => {
      clearSection(`#${section} dl`)
    })
    requests.clear()
    currentKey = ''
    counts = Object.fromEntries(
      Object.keys(elements.sections).map((key) => [key, 0])
    )
    typeBytes = Object.fromEntries(
      Object.keys(elements.sections).map((key) => [key, 0])
    )
  }

  const updateSection = (type, request) => {
    const section = elements.sections[type]
    if (!section) return

    const details = section.querySelector('details')
    const counter = section.querySelectorAll('div')[0]
    const bytes = section.querySelectorAll('div')[1]
    const dl = section.querySelector('dl') || document.createElement('dl')

    const dt = document.createElement('dt')
    const dd = document.createElement('dd')
    const dd_div1 = document.createElement('div')
    const dd_div2 = document.createElement('div')

    // Add request url
    dt.textContent = request.url

    // Add request bytes
    dd_div1.textContent = request.bytes
    dd_div2.textContent = request.uncompressedBytes

    dd.append(dd_div1, dd_div2)
    dl.append(dt, dd)

    details.append(dl)

    // Update summary data (count and kilobytes)
    counts[type]++
    counter.textContent = `count: ${counts[type]}`
    typeBytes[type] = typeBytes[type] + request.bytes
    bytes.textContent = `kilobytes: ${(typeBytes[type] / 1000).toFixed(2)}`
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'url-changed' || message.action === 'url-reloaded') {
      resetPanelDisplay()
    }

    if (message.action === 'network-traffic') {
      // Show summary data
      Object.entries(message.data).forEach(([key, value]) =>
        showSummaryData(key, value)
      )

      // Show request details categories
      document.querySelector('.hidden')?.classList.remove('hidden')

      try {
        Object.entries(message.data.data.groupedByType).forEach(
          ([type, value]) => {
            if (!value?.length) return

            value.forEach((request) => {
              if (currentKey !== request.key) {
                currentKey = request.key
              }
              if (!requests.has(request?.url)) {
                updateSection(type, request)
                requests.add(request.url)
              }
            })
          }
        )
      } catch (error) {
        console.error('Error processing network traffic:', error)
      }

      // Hide visitor notification to reload the page
      elements.notification.style.display = 'none'
    }
  })
})
