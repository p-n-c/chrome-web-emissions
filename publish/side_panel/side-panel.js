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

  const clearSections = () => {
    document.getElementById('document').innerHTML = ''
    document.getElementById('script').innerHTML = ''
    document.getElementById('image').innerHTML = ''
    document.getElementById('other').innerHTML = ''
  }

  const notification = document.getElementById('notification')

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'network-traffic') {
      for (const [key, value] of Object.entries(message.data)) {
        show(key, value)
      }

      const template = document.getElementById('dl-template')
      const clone = template.content.cloneNode(true)

      document.querySelector('.hidden')?.classList.remove('hidden')

      try {
        for (const [type, value] of Object.entries(
          message.data.data.groupedByType
        )) {
          const section = document.getElementById(type)

          const h3 = document.createElement('h3')
          const dl = document.createElement('dl')

          h3.innerText = type

          value.forEach((request) => {
            if (key !== request.key) {
              requests = []
              key = request.key
              clearSections()
            }
            if (!requests.includes(request.url)) {
              const dt = clone.querySelector('dt')
              const dd = clone.querySelector('dd')
              dt.innerText = request.url
              dd.innerText = request.bytes
              dl.append(clone)

              requests.push(request.url)

              section.append(h3)
              section.append(dl)
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
