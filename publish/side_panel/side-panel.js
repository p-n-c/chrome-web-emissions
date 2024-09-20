/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', () => {
  const show = (id, value) => {
    if (id === 'data') return
    const displayValue = id === 'bytes' ? value / 1000 : value
    const element = document.getElementById(id)
    if (element) element.innerText = displayValue
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'network-traffic') {
      // Handle the network traffic data
      updateNetworkTrafficUI(message.data)
    }
  })

  const updateNetworkTrafficUI = (data) => {
    for (const [key, value] of Object.entries(data)) {
      show(key, value)
    }
  }
})
