/* eslint-disable no-undef */
const show = (id, value) => {
  const displayValue = id === 'bytes' ? value / 1000 : value
  document.getElementById(id).innerHTML = displayValue
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.action === 'network-traffic') {
      console.log('message.result: ', message.result)
      for (const [key, value] of Object.entries(message.result)) {
        show(key, value)
      }
    }
    if (message?.action === 'page-change') {
      show('url', message.url)
      show('bytes', 0)
      show('count', 0)
      show('greenHosting', '')
      show('mgCO2', 0)
      notification()
    }
  })
})

function notification() {
  let countdownValue = 5

  const countdownDisplay = document.getElementById('countdown')

  const countdownInterval = setInterval(() => {
    countdownDisplay.textContent = `The report will appear in ${countdownValue} seconds.`
    countdownValue--
    if (countdownValue < 0) {
      clearInterval(countdownInterval)
      countdownDisplay.textContent = ''
    }
  }, 1000)
}

notification()
