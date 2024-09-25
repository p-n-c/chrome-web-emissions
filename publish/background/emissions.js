import { co2_default, hosting_default } from './tgwf-co2.js'

const DB = 'emissionsDB'
const STORE = 'emissions'

const compressionRates = {
  brotli: [
    {
      level: 0,
      rate: 1.2,
    },
    {
      level: 1,
      rate: 2.1,
    },
    {
      level: 2,
      rate: 2.5,
    },
    {
      level: 3,
      rate: 3.0,
    },
    {
      level: 4,
      rate: 3.5,
    },
    {
      level: 5,
      rate: 4.0,
    },
    {
      level: 6,
      rate: 4.3,
    },
    {
      level: 7,
      rate: 4.6,
    },
    {
      level: 8,
      rate: 4.9,
    },
    {
      level: 9,
      rate: 5.0,
    },
    {
      level: 10,
      rate: 5.1,
    },
    {
      level: 11,
      rate: 5.2,
    },
  ],
  gzip: [
    {
      level: 0,
      rate: 1,
    },
    {
      level: 1,
      rate: 1.5,
    },
    {
      level: 2,
      rate: 2.0,
    },
    {
      level: 3,
      rate: 2.3,
    },
    {
      level: 4,
      rate: 2.5,
    },
    {
      level: 5,
      rate: 2.8,
    },
    {
      level: 6,
      rate: 3.0,
    },
    {
      level: 7,
      rate: 3.2,
    },
    {
      level: 8,
      rate: 3.3,
    },
    {
      level: 9,
      rate: 3.4,
    },
  ],
}

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

const estimateBrotliCompressedSize = (bytes, requestType) => {
  // Define compression ratio matrix based on content type and file size
  const compressionMatrix = {
    document: [
      { sizeThreshold: 50000, compressionRatio: 0.6, brotliLevel: 5 },
      { sizeThreshold: 100000, compressionRatio: 0.4, brotliLevel: 6 },
      { sizeThreshold: Infinity, compressionRatio: 0.2, brotliLevel: 8 },
    ],
    script: [
      { sizeThreshold: 20000, compressionRatio: 0.7, brotliLevel: 5 },
      { sizeThreshold: 100000, compressionRatio: 0.5, brotliLevel: 6 },
      { sizeThreshold: Infinity, compressionRatio: 0.3, brotliLevel: 8 },
    ],
    css: [
      { sizeThreshold: 10000, compressionRatio: 0.7, brotliLevel: 4 },
      { sizeThreshold: 100000, compressionRatio: 0.5, brotliLevel: 5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3, brotliLevel: 8 },
    ],
    image: [
      { sizeThreshold: Infinity, compressionRatio: 0.95, brotliLevel: 1 }, // Minimal compression for images
    ],
    other: [
      { sizeThreshold: 50000, compressionRatio: 0.6, brotliLevel: 5 },
      { sizeThreshold: 100000, compressionRatio: 0.4, brotliLevel: 6 },
      { sizeThreshold: Infinity, compressionRatio: 0.2, brotliLevel: 8 },
    ],
  }

  // No compression for video or fonts
  if (requestType === 'video' || requestType === 'font') return bytes

  // Check if request type exists in the matrix
  if (!compressionMatrix[requestType]) {
    throw new Error('Unsupported content type')
  }

  // Find appropriate compression ratio and level based on file size
  for (const {
    sizeThreshold,
    compressionRatio,
    brotliLevel,
  } of compressionMatrix[requestType]) {
    if (bytes <= sizeThreshold) {
      const compressedBytes = bytes * compressionRatio
      return { compressedBytes, brotliLevel }
    }
  }

  return null // This shouldn't happen if contentType is valid
}

const compressUncompressedBytes = ({
  encoding,
  bytes,
  compressionOptions,
  resourceType,
}) => {
  // default compression rates
  let BR = compressionRates.brotli.find((b) => b.level === 3).rate
  let GZIP = compressionRates.gzip.find((g) => g.level === 5).rate
  let DEFLATE = 1 // tbd
  let ZSTD = 1 // tbd

  if (compressionOptions) {
    BR =
      compressionRates.brotli.find((b) => b.level === compressionOptions.br)
        ?.rate || BR
    GZIP =
      compressionRates.gzip.find((g) => g.level === compressionOptions.gzip)
        ?.rate || GZIP
  }

  let ratio, brotliBytes
  switch (encoding) {
    case 'br':
      ratio = BR
      // override estimate with brotli specific algorithm
      brotliBytes = estimateBrotliCompressedSize(bytes, resourceType)
      return brotliBytes?.compressedBytes || bytes
    case 'gzip':
      ratio = GZIP
      break
    case 'deflate':
      ratio = DEFLATE
      break
    case 'zstd':
      ratio = ZSTD
      break
    default:
      ratio = 1
  }

  return Math.round(bytes / ratio)
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

export const saveNetworkTraffic = async (record) => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const emissions = tx.objectStore(STORE)

  await emissions.add(record)

  db.close()
}

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

const format = ({
  number,
  locale = 'en-GB',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}) => {
  // return number
  return (
    number?.toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }) || 'n/a'
  )
}

const getDomainFromURL = (url) => {
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

const getHostingOptions = (options, domain) => {
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

const groupByType = (responses) => {
  return responses.reduce((acc, item) => {
    const { resourceType, ...rest } = item
    if (!acc[resourceType]) {
      acc[resourceType] = []
    }
    acc[resourceType].push(rest)
    return acc
  }, {})
}

const groupByTypeBytes = (groupedByType) => {
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
      processResponses(records)

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
