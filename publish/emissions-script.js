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
    })
  } catch (e) {
    console.log(e)
    console.log('error for url: ', url)
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

  await browser.clearPageEmissions()

  return { bytes, count, greenHosting, mgCO2 }
}
