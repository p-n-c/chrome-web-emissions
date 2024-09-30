import { co2_default, hosting_default } from './tgwf-co2.js'
import { getCompressedSize } from './compression.js'
import {
  format,
  getDomainFromURL,
  getHostingOptions,
  groupByType,
  groupByTypeBytes,
} from './utils.js'

const DB = 'emissionsDB'
const STORE = 'emissions'

const getBytes = ({
  compressedBytes,
  uncompressedBytes,
  encoding,
  compressionOptions,
  resourceType,
}) => {
  if (compressedBytes !== 0) return compressedBytes

  return (
    compressUncompressedBytes({
      encoding,
      bytes: uncompressedBytes,
      compressionOptions,
      resourceType,
    }) || 0
  )
}

const compressUncompressedBytes = ({ encoding, bytes, resourceType }) => {
  return encoding !== 'n/a'
    ? getCompressedSize(bytes, resourceType, encoding)
    : 0
}

const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        // Use auto generated id` as the record key
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
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
      ? hosting_default.check(domain, options)
      : hosting_default.check(domain)
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
  const emissions = new co2_default(model)

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

export const getResponseDetails = async (response, env, compressionOptions) => {
  const acceptedStatuses = [200, 204, 302, 303, 304]
  const status = response.status

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const isBrowser = env === 'browser'

  const getHeader = (header) => response.headers.get(header)
  const getBuffer = async () => response.arrayBuffer()

  const url = isBrowser ? response.url : response.url()
  const contentLength = getHeader('Content-Length')
  const contentType = getHeader('Content-Type')
  const contentEncoding = getHeader('Content-Encoding') || 'n/a'
  const buffer = await getBuffer()

  const uncompressedBytes = buffer.byteLength
  const compressedBytes = contentLength ? parseInt(contentLength, 10) : 0

  let resourceType

  if (contentType?.includes('text/html')) {
    resourceType = 'document'
  } else if (contentType?.includes('javascript')) {
    resourceType = 'script'
  } else if (contentType?.includes('video')) {
    resourceType = 'video'
  } else if (contentType?.includes('image')) {
    resourceType = 'image'
  } else if (contentType?.includes('css')) {
    resourceType = 'css'
  } else if (contentType?.includes('font')) {
    resourceType = 'font'
  } else {
    resourceType = 'other'
  }

  const bytes = getBytes({
    compressedBytes,
    uncompressedBytes,
    encoding: contentEncoding,
    compressionOptions,
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
  }
}

export const saveNetworkTraffic = async (record) => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const emissions = tx.objectStore(STORE)

  await emissions.add(record)

  db.close()
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
