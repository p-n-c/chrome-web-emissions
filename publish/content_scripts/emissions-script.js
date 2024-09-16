/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const setMyPageEmissions = async (urls) => {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const response = await fetch(url)
        const clonedResponse = response.clone()
        const responseDetails = await getResponseDetails(
          clonedResponse,
          'browser'
        )

        if (responseDetails) {
          await saveNetworkTraffic(responseDetails)
          return { status: 'fulfilled', value: url }
        } else {
          return {
            status: 'rejected',
            reason: `No response details for ${url}`,
          }
        }
      } catch (error) {
        return {
          status: 'rejected',
          reason: `Error processing ${url}: ${error.message}`,
        }
      }
    })
  )

  const successful = results.filter((result) => result.status === 'fulfilled')
  const failed = results.filter((result) => result.status === 'rejected')

  console.log(`Successfully processed ${successful.length} URLs`)
  if (failed.length > 0) {
    console.error(`Failed to process ${failed.length} URLs:`)
    failed.forEach((result) => console.error(result.reason))
  }

  return { successful, failed }
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
