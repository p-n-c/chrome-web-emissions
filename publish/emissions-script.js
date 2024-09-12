/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const setMyPageEmissions = async (urls) => {
  try {
    urls.forEach(async (url) => {
      const response = await fetch(url)
      const clonedResponse = response.clone()
      const responseDetails = await getResponseDetails(
        clonedResponse,
        'browser'
      )

      if (responseDetails) {
        await saveNetworkTraffic(responseDetails)
      }

      console.log('responseDetails: ', responseDetails)

      return response
    })
  } catch (e) {
    console.log(e)
  }
}

const getMyPageEmissions = async (url) => {
  const options = {
    hostingOptions: {
      verbose: true,
      forceGreen: true,
    },
  }

  const { bytes, count, greenHosting, mgCO2 } = await browser.getPageEmissions(
    url,
    options
  )

  console.log(`Report for ${url}`)
  console.log('Page weight: ', `${bytes / 1000} Kbs`)
  console.log('Requests ', count)
  console.log('Emissions: ', `${mgCO2} mg of CO2`)
  console.log(
    greenHosting ? 'Hosting: green hosting' : 'Hosting: not green hosting'
  )

  await browser.clearPageEmissions()

  return { bytes, count, greenHosting, mgCO2 }
}
