/* eslint-disable no-undef */

document.addEventListener('DOMContentLoaded', () => {
  const show = (id, value) => {
    if (id === 'data') return
    const displayValue = id === 'bytes' ? value / 1000 : value
    const element = document.getElementById(id)
    if (element) element.innerText = displayValue
  }

  let requests = []
  let key = ''
  let count = {
    document: 0,
    script: 0,
    css: 0,
    image: 0,
    video: 0,
    font: 0,
    other: 0,
  }

  const clearSection = (selector) => {
    const element = document.querySelector(selector)
    if (element) element.innerHTML = ''
    else console.log(selector, ' does not have corresponding element')
  }

  const reset = () => {
    clearSection('#document > dl')
    clearSection('#script > dl')
    clearSection('#css > dl')
    clearSection('#image > dl')
    clearSection('#video > dl')
    clearSection('#font > dl')
    clearSection('#other > dl')

    requests = []
    key = ''
    count = {
      document: 0,
      script: 0,
      css: 0,
      image: 0,
      video: 0,
      font: 0,
      other: 0,
    }
  }

  const notification = document.getElementById('notification')

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'url-changed' || message.action === 'url-reloaded') {
      console.log(`URL changed to: ${message?.url}`)
      console.log('key was: ', key)
      reset()
    }
    if (message.action === 'network-traffic') {
      for (const [key, value] of Object.entries(message.data)) {
        show(key, value)
      }

      document.querySelector('.hidden')?.classList.remove('hidden')

      try {
        for (const [type, value] of Object.entries(
          message.data.data.groupedByType
        )) {
          const section = document.getElementById(type)
          const details = section.querySelector('details')
          const counter = section.querySelector('div')
          const template = document.getElementById('dl-template')
          const clone = template.content.cloneNode(true)
          const dl = section.querySelector('dl')

          if (!value?.length) return

          value.forEach((request) => {
            if (key !== request.key) {
              key = request.key
            }
            if (!requests.includes(request?.url)) {
              const dt = clone.querySelector('dt')
              const dd = clone.querySelector('dd')
              if (dt) dt.innerText = request.url
              if (dd) dd.innerText = request.bytes
              dl.append(clone)

              requests.push(request.url)
              console.log('requests count: ', requests.length)
              details.append(dl)

              count[type] = count[type] + 1
              counter.innerText = `count: ${count[type]}`
              console.log(type)
              console.log(count)
              console.log(value)
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
      notification.style.display = 'none'
    }
  })
})
