import { browser } from '@danhartley/emissions'

const getPageEmissions = (url) => {
  console.log('url from service worker:', url)
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
