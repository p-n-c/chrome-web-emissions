/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', (event) => {
  console.log(event)
  chrome.runtime.sendMessage({ type: 'DOMContentLoaded' })
})
