/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', () => {
  const show = (id, value) => {
    if (id === 'data') return
    const displayValue = id === 'bytes' ? value / 1000 : value
    document.getElementById(id).innerHTML = displayValue
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'network-traffic') {
      // Handle the network traffic data
      console.log('Received network traffic data:', message.data)

      // Update your UI or perform any other actions with the data
      updateNetworkTrafficUI(message.data)

      return true
    }
  })

  const updateNetworkTrafficUI = (data) => {
    for (const [key, value] of Object.entries(data)) {
      show(key, value)
    }
  }
})
