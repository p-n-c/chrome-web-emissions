import { co2, hosting } from './tgwf/index.js'
import { getCompressedSize } from './compression.js'
import {
  format,
  getDomainFromURL,
  getHostingOptions,
  groupByType,
  groupByTypeBytes,
  getDPRMultiplier,
  mapRequestTypeToType,
} from './utils.js'

const DB = 'emissionsDB'
const STORE = 'emissions'

const getBytes = ({
  compressedBytes,
  uncompressedBytes,
  encoding,
  resourceType,
}) => {
  return getCompressedSize(
    compressedBytes,
    uncompressedBytes,
    resourceType,
    encoding
  )
}

const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 4) // DB instance stands at 4 (reflects required indices)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const objectStore = db.createObjectStore(STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        objectStore.createIndex('url', 'url', { unique: true }) // Create the 'url' index
      } else {
        // If the store exists but the index doesn't, create the index
        const store = event.target.transaction.objectStore(STORE)
        if (!store.indexNames.contains('url')) {
          store.createIndex('url', 'url', { unique: true })
        }
      }
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

const getRecords = (store) => {
  return new Promise((resolve, reject) => {
    const responses = []
    const request = store.openCursor()

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        responses.push(cursor.value)
        cursor.continue()
      } else {
        resolve(responses)
      }
    }

    request.onerror = (event) => {
      reject(event.target.error)
    }
  })
}

const hasGreenWebHost = async (hostingOptions) => {
  try {
    const { domain } = hostingOptions
    const { options } = hostingOptions
    return (await options)
      ? hosting.check(domain, options)
      : hosting.check(domain)
  } catch (e) {
    console.error('Error checking green status:', e)
    throw e
  }
}

const output = ({
  url,
  bytes,
  greenHosting,
  responses,
  emissions,
  groupedByType,
  groupedByTypeBytes,
  totalUncachedBytes,
}) => {
  return {
    url,
    bytes,
    count: responses.length,
    greenHosting,
    emissions,
    mgCO2: format({ number: emissions * 1000, maximumFractionDigits: 0 }),
    data: {
      groupedByType,
      groupedByTypeBytes,
      totalUncachedBytes,
    },
  }
}

const getEmissions = async ({ bytes, model = '1byte', hostingOptions }) => {
  const emissions = new co2(model)

  try {
    const forceGreen = hostingOptions?.options?.forceGreen === true
    const webHosting = forceGreen || (await hasGreenWebHost(hostingOptions))
    const greenHosting = webHosting.url ? webHosting.green : webHosting

    return {
      emissions: emissions.perByte(bytes, greenHosting),
      greenHosting,
    }
  } catch (e) {
    console.error('Error calculating emissions:', e)
    throw e
  }
}

const processResponses = (responses) => {
  const validResponses = responses.filter((res) => res)

  const groupedByType = groupByType(validResponses)
  const groupedByTypeBytes = groupByTypeBytes(groupedByType)

  const bytes =
    groupedByTypeBytes.reduce((acc, curr) => acc + (curr?.bytes || 0), 0) || 0

  const totalUncachedBytes = groupedByTypeBytes.reduce(
    (acc, curr) => acc + curr.uncachedBytes,
    0
  )

  return {
    bytes,
    groupedByType,
    groupedByTypeBytes,
    totalUncachedBytes,
  }
}

export const getResponseDetails = async (response, env, method, type, dpr) => {
  const acceptedStatuses = [200, 204, 302, 303, 304]
  const status = response.status

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const isBrowser = env === 'browser'

  const getHeader = (header) => response.headers.get(header)
  const getBuffer = async () => response.arrayBuffer()

  const url = isBrowser ? response.url : response.url()
  const contentType = getHeader('Content-Type')
  const contentEncoding = getHeader('Content-Encoding') || 'n/a'
  const buffer = await getBuffer()

  let contentLength = getHeader('Content-Length')

  if (type === 'image') {
    // In order to factor in the discrepancy between the reported response size and the size given in Chrome DevTools we have to take into account the Device Pixel Ratio (DPR).
    // e.g. a DPR of 2 means that for every 1 logical pixel, there are 2 physical pixels in each dimension. This results in 4 physical pixels for every 1 logical pixel in total area.
    // The ratio between the request response image size and the reported size in DevTools (~0.7) is close to 1/√2, which is approximately 0.707.
    // This √2 factor often comes into play with DPR calculations because it represents the scaling factor for linear dimensions (width or height) when the total pixel count is doubled.
    // The request response is reporting the full, physical pixel dimensions of the image.
    // DevTools is reporting the logical pixel dimensions, which are scaled down by a factor related to the DPR.
    contentLength = contentLength * getDPRMultiplier(dpr)
  }

  const uncompressedBytes = buffer.byteLength
  const compressedBytes = contentLength ? parseInt(contentLength, 10) : 0
  const resourceType = mapRequestTypeToType(type)

  const { bytes, compressionRatio } = getBytes({
    compressedBytes,
    uncompressedBytes,
    encoding: contentEncoding,
    resourceType,
  })

  return {
    url,
    contentType,
    compressedBytes,
    uncompressedBytes,
    bytes,
    encoding: contentEncoding,
    resourceType,
    compressionRatio,
  }
}

export const saveNetworkTraffic = async (record) => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const emissions = tx.objectStore(STORE)

  const index = emissions.index('url') // Use the 'url' index
  const request = index.get(record.url) // Unique request url

  request.onsuccess = function (event) {
    if (event.target.result) {
      // Record exists, update it
      emissions.put({ ...event.target.result, ...record })
    } else {
      // Record doesn't exist, add it
      emissions.add(record)
    }
  }

  request.onerror = function () {
    console.error('Error searching for record')
  }

  // Close database after transaction completes
  tx.oncomplete = function () {
    db.close()
  }

  tx.onerror = function (event) {
    console.error('Transaction failed: ', event.target.error)
  }
}

export const getNetworkTraffic = async (key, url, options) => {
  try {
    const domain = getDomainFromURL(url)

    const db = await openDatabase()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)

    const records = await getRecords(store)
    const tabRecords = records.filter((record) => record.key === key)
    const bytes = tabRecords.reduce((acc, curr) => acc + curr.bytes, 0)
    const { emissions, greenHosting } = await getEmissions({
      bytes,
      hostingOptions: getHostingOptions(options, domain),
    })

    const { groupedByType, groupedByTypeBytes, totalUncachedBytes } =
      processResponses(tabRecords)

    const report = output({
      url,
      bytes,
      greenHosting,
      count: tabRecords.length,
      responses: tabRecords,
      emissions,
      groupedByType,
      groupedByTypeBytes,
      totalUncachedBytes,
    })

    return report
  } catch (error) {
    throw new Error(`Failed to get network traffic: ${error.message}`)
  }
}

export const clearNetworkTraffic = async () => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)

  store.clear().onsuccess = function () {
    console.log(`Object store ${STORE} cleared.`)
  }

  tx.oncomplete = function () {
    db.close()
  }

  tx.onerror = function (event) {
    console.error('Transaction error:', event.target.error)
  }
}
