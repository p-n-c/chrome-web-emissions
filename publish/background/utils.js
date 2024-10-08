const getDomainByPatternMatching = ({ url }) => {
  let result
  let match
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im
    ))
  ) {
    result = match[1]
    if ((match = result.match(/^[^.]+\.(.+\..+)$/))) {
      result = match[1]
    }
  }
  return result
}

const sortBy = ({ arr, prop, dir = 'asc' }) => {
  return dir === 'asc'
    ? arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return x - y
      })
    : arr.sort((a, b) => {
        const x = a[prop]
        const y = b[prop]
        return y - x
      })
}

const safeComparison = (a, b) => (isNaN(a) || isNaN(b) ? 0 : a - b)

export const format = ({
  number,
  locale = 'en-GB',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}) => {
  if (number === 0) return 0
  if (number === null || number === undefined || isNaN(number)) {
    return 'n/a'
  }

  return number.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

export const getDomainFromURL = (url) => {
  try {
    const parsedURL = new URL(url)
    let hostname = parsedURL.hostname

    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4)
    }

    return hostname
  } catch (e) {
    // If the built in parser fails, as it will for e.g. bbcorp.fr, use pattern matching
    if (e.code === 'ERR_INVALID_URL') {
      return getDomainByPatternMatching({ url })
    }
  }
}

export const getHostingOptions = (options, domain) => {
  if (options?.hostingOptions) {
    return {
      domain,
      options: {
        ...options.hostingOptions,
      },
    }
  }
  return { domain }
}

export const groupByType = (responses) => {
  return responses.reduce((acc, item) => {
    const { resourceType, ...rest } = item
    if (!acc[resourceType]) {
      acc[resourceType] = []
    }
    acc[resourceType].push(rest)
    return acc
  }, {})
}

export const groupByTypeBytes = (groupedByType) => {
  const groupedByTypeBytes = []
  for (let [key] of Object.entries(groupedByType)) {
    if (key !== 'undefined') {
      groupedByType[key] = sortBy({
        arr: groupedByType[key],
        prop: 'bytes',
        dir: 'desc',
      })

      const groupBytes = {
        type: key,
        bytes: groupedByType[key].reduce((acc, curr) => acc + curr.bytes, 0),
        uncachedBytes: groupedByType[key].reduce((acc, curr) => {
          const uncached = curr.fromCache ? 0 : curr.uncompressedBytes
          return acc + uncached
        }, 0),
        count: groupedByType[key].length,
      }
      groupedByTypeBytes.push(groupBytes)
    }
  }
  return groupedByTypeBytes
}

export const getDPRMultiplier = (dpr) => {
  if (dpr <= 1) {
    // For DPR 1 or lower, no need to adjust the size
    return 1
  } else {
    // Adjust using the square root of the device pixel ratio
    return 1 / Math.sqrt(dpr)
  }
}

export const mapRequestTypeToType = (type) => {
  switch (type) {
    case 'xmlhttprequest':
      return 'xhr'
    case 'stylesheet':
      return 'css'
    case 'main_frame':
    case 'sub_frame':
    case 'ping':
      return 'document'
    default:
      return type
  }
}

export const extractScheme = (url) => {
  try {
    const scheme = new URL(url).protocol
    // Remove the colon (:) at the end of the protocol (e.g., 'http:')
    return scheme.replace(':', '')
  } catch (e) {
    console.error('Invalid URL:', e.message)
    return null
  }
}

export const saveTrackerSummary = (summary) => {
  try {
    // Convert the summary object to a string for storage
    const summaryString = JSON.stringify(summary)
    localStorage.setItem(summary.url, summaryString)
    console.log('Tracker summary saved successfully.')
    return true
  } catch (e) {
    console.error('Error saving tracker summary:', e)
    return false
  }
}

export const getTrackerSummary = (url) => {
  try {
    const summaryString = localStorage.getItem(url)
    if (summaryString) {
      return JSON.parse(summaryString)
    } else {
      console.warn('No tracker summary found in localStorage.')
      return null
    }
  } catch (e) {
    console.error('Error retrieving tracker summary:', e)
    return null
  }
}

export const convertTimestampToLocalDateTime = (timestamp) => {
  const date = new Date(timestamp)
  // Return a formatted string with local date and time
  return date.toLocaleString() // Adjusts for the user's time zone and locale
}

export const compareCurrentAndPreviousSummaries = (url, summary) => {
  if (!url) return

  const previousSummary = getTrackerSummary(url)

  if (previousSummary) {
    const summaryBytes = document.getElementById('bytes')
    const summaryRequests = document.getElementById('request-count')
    const summaryEmissions = document.getElementById('mgCO2')

    if (!summaryBytes || !summaryRequests || !summaryEmissions) return

    const updateClass = (element, previousValue, currentValue) => {
      if (safeComparison(previousValue, currentValue) > 0) {
        element.classList.add('down')
        element.classList.remove('up')
      } else if (safeComparison(currentValue, previousValue) > 0) {
        element.classList.add('up')
        element.classList.remove('down')
      } else {
        element.classList.remove('up', 'down')
      }
    }

    updateClass(summaryBytes, previousSummary.bytes, summary.bytes)
    updateClass(
      summaryRequests,
      previousSummary.requestCount,
      summary.requestCount
    )
    updateClass(summaryEmissions, previousSummary.mgCO2, summary.mgCO2)
  }
}

export const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error)
}

export const exportJSON = (data, filename = 'tracker-summary.json') => {
  // Step 1: Convert JSON data to a string
  const jsonStr = JSON.stringify(data, null, 2) // Pretty print with 2 spaces

  // Step 2: Create a Blob from the JSON string
  const blob = new Blob([jsonStr], { type: 'application/json' })

  // Step 3: Create a temporary link element
  const link = document.createElement('a')

  // Step 4: Create a URL for the Blob and set it as the href for the link
  link.href = URL.createObjectURL(blob)

  // Step 5: Set the download attribute with a filename
  link.download = filename

  // Step 6: Append the link to the body (necessary for Firefox)
  document.body.appendChild(link)

  // Step 7: Programmatically click the link to trigger the download
  link.click()

  // Step 8: Remove the link from the document after the download
  document.body.removeChild(link)
}

export const groupRequestsByType = (dataSet) => {
  // Create an object to hold the grouped data
  const groupedRequests = {}

  // Iterate through the Set
  dataSet.forEach((item) => {
    const { type, requests } = item

    // If the type is not already in the object, initialize it as an array
    if (!groupedRequests[type]) {
      groupedRequests[type] = []
    }

    // Append the requests to the corresponding type
    groupedRequests[type].push(...requests)
  })

  return groupedRequests
}
