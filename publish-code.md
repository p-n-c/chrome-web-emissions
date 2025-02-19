<documents>
<document index="1">
<source>./publish/manifest.json</source>
<document_content>
{
  "manifest_version": 3,
  "name": "Emissions Tracker by People & Code",
  "version": "0.0.0.1",
  "description": "Track emissions from page requests in real-time.",
  "permissions": ["activeTab", "sidePanel", "tabs", "webRequest"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  "action": {},
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "side_panel": {
    "default_path": "side_panel/side-panel.html"
  }
}

</document_content>
</document>
<document index="2">
<source>./publish/background\compression.js</source>
<document_content>
const compressionRates = {
  br: [
    { level: 0, rate: 1 / 1.2 }, // Inverted
    { level: 1, rate: 1 / 2.1 },
    { level: 2, rate: 1 / 2.5 },
    { level: 3, rate: 1 / 3.0 },
    { level: 4, rate: 1 / 3.5 },
    { level: 5, rate: 1 / 4.0 },
    { level: 6, rate: 1 / 4.3 },
    { level: 7, rate: 1 / 4.6 },
    { level: 8, rate: 1 / 4.9 },
    { level: 9, rate: 1 / 5.0 },
    { level: 10, rate: 1 / 5.1 },
    { level: 11, rate: 1 / 5.2 },
  ],
  gzip: [
    { level: 0, rate: 1 }, // No change
    { level: 1, rate: 1 / 1.5 }, // Inverted
    { level: 2, rate: 1 / 2.0 },
    { level: 3, rate: 1 / 2.3 },
    { level: 4, rate: 1 / 2.5 },
    { level: 5, rate: 1 / 2.8 },
    { level: 6, rate: 1 / 3.0 },
    { level: 7, rate: 1 / 3.2 },
    { level: 8, rate: 1 / 3.3 },
    { level: 9, rate: 1 / 3.4 },
  ],
  deflate: [
    { level: 0, rate: 1 }, // No change
    { level: 1, rate: 1 / 1.6 }, // Inverted
    { level: 2, rate: 1 / 2.2 },
    { level: 3, rate: 1 / 2.8 },
    { level: 4, rate: 1 / 3.1 },
    { level: 5, rate: 1 / 3.3 },
    { level: 6, rate: 1 / 3.5 },
    { level: 7, rate: 1 / 3.6 },
    { level: 8, rate: 1 / 3.7 },
    { level: 9, rate: 1 / 3.8 },
  ],
  zstd: [
    { level: 0, rate: 1 / 1.1 }, // Inverted
    { level: 1, rate: 1 / 1.9 },
    { level: 2, rate: 1 / 2.3 },
    { level: 3, rate: 1 / 2.7 },
    { level: 4, rate: 1 / 3.0 },
    { level: 5, rate: 1 / 3.2 },
    { level: 6, rate: 1 / 3.4 },
    { level: 7, rate: 1 / 3.6 },
    { level: 8, rate: 1 / 3.8 },
    { level: 9, rate: 1 / 4.0 },
  ],
}

const compressionStrategies = {
  xhr: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 11).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 11).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  document: {
    br: [
      {
        sizeThreshold: 50000,
        rate: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 10).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 11).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 50000,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 50000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 50000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  css: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  script: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 1).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 4).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 3).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 7).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 8).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  font: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  image: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  media: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  other: {
    br: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.br.find((r) => r.level === 8).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.deflate.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.deflate.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.deflate.find((r) => r.level === 9).rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        rate: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        rate: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        rate: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
}

export const getCompressedSize = (
  compressedBytes,
  uncompressedBytes,
  requestType,
  encoding
) => {
  if (
    !compressionStrategies[requestType] ||
    !compressionStrategies[requestType][encoding] ||
    compressedBytes !== 0
  ) {
    return {
      bytes: compressedBytes,
      rate: 'n/a',
    }
  }

  const getCompressionStrategy = (requestType, encoding, uncompressedBytes) => {
    const strategies = compressionStrategies[requestType][encoding]
    return strategies.find(
      ({ sizeThreshold }) => uncompressedBytes <= sizeThreshold
    )
  }

  const strategy = getCompressionStrategy(
    requestType,
    encoding,
    uncompressedBytes
  )

  // No matching threshold found, return original size
  if (!strategy) return uncompressedBytes

  const compressionRate = strategy.rate

  return {
    bytes: Math.round(uncompressedBytes * compressionRate),
    compressionRate,
  }
}

</document_content>
</document>
<document index="3">
<source>./publish/background\emissions.js</source>
<document_content>
import { co2, hosting } from './tgwf/index.js'
import { getCompressedSize } from './compression.js'
import {
  getDomainFromURL,
  getHostingOptions,
  groupByType,
  groupByTypeBytes,
  getDPRMultiplier,
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
    const request = indexedDB.open(DB, 5) // DB instance stands at 5 (reflects required indices)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const objectStore = db.createObjectStore(STORE, {
          keyPath: 'id',
          autoIncrement: true,
        })
        objectStore.createIndex('urlAndType', 'urlAndType', { unique: false })
      } else {
        // If the store exists but the index doesn't, create the index
        const store = event.target.transaction.objectStore(STORE)
        if (!store.indexNames.contains('urlAndType')) {
          store.createIndex('urlAndType', 'urlAndType', { unique: false })
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
    mgCO2: emissions * 1000,
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

export const getResponseDetails = async (
  response,
  env,
  type,
  resourceType,
  dpr
) => {
  const acceptedStatuses = [200, 204, 302, 303, 304]
  const status = response.status

  if (!response || !acceptedStatuses.includes(status)) {
    return null
  }

  const isBrowser = env === 'browser'

  const getHeader = (header) => response.headers.get(header)
  const getBuffer = async () => {
    return await response.arrayBuffer()
  }

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

  const { bytes, compressionRate } = getBytes({
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
    compressionRate,
  }
}

export const saveNetworkTraffic = async (record) => {
  const db = await openDatabase()
  const tx = db.transaction(STORE, 'readwrite')
  const emissions = tx.objectStore(STORE)

  record.urlAndType = `${record.url}:${record.type}`
  const index = emissions.index('urlAndType') // Use the 'urlAndType' index
  const request = index.get(record.urlAndType) // Unique request url

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
    console.log(`The ${STORE} object store was cleared`)
  }

  tx.oncomplete = function () {
    db.close()
  }

  tx.onerror = function (event) {
    console.error('Transaction error:', event.target.error)
  }
}

</document_content>
</document>
<document index="4">
<source>./publish/background\service-worker.js</source>
<document_content>
/* eslint-disable no-undef */

import {
  getResponseDetails,
  saveNetworkTraffic,
  getNetworkTraffic,
  clearNetworkTraffic,
} from './emissions.js'

import { handleError, mapRequestTypeToType } from './utils.js'

// Device Pixel Ratio
let dpr
let webRequestListener
let isSidePanelOpen = false

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)

  if (tab && tab.active) {
    return tab
  } else {
    return null
  }
}

const closeSidePanel = () => {
  chrome.runtime.sendMessage({
    action: 'close-side-panel',
  })
}

chrome.action.onClicked.addListener((tab) => {
  // Visitor clicks on the extension icon
  toggleWebRequestListener(!isSidePanelOpen)
  if (isSidePanelOpen) {
    closeSidePanel()
  } else {
    chrome.sidePanel.open({ windowId: tab.windowId })
  }
  // Toggle side panel visibility
  isSidePanelOpen = !isSidePanelOpen
})

// Update network traffic
function sendMessageToSidePanel(data) {
  chrome.sidePanel.getOptions({}, (options) => {
    if (options.enabled) {
      chrome.runtime.sendMessage({
        action: 'network-traffic',
        data,
      })
    } else {
      console.log('Side panel is not enabled')
    }
  })
}

// Handle network requests (triggered by page load)
const handleRequest = async (details) => {
  const activeTab = await getCurrentTab()

  const isActiveTab = activeTab?.id === details.tabId

  // Ensure it's a request associated with the current tab (page)
  if (isActiveTab) {
    const { url, initiator, method, type } = details

    // Implicitly exclude, for example, wss
    const permittedSchema = ['http:', 'https:']

    let response, scheme

    try {
      response = await fetch(url)
      scheme = new URL(response.url)?.protocol
    } catch (e) {
      handleError(e, 'handle request')
    }

    const resourceType = mapRequestTypeToType(type)

    if (permittedSchema.includes(scheme)) {
      const clonedResponse = response.clone()
      const responseDetails = await getResponseDetails(
        clonedResponse,
        'browser',
        type,
        resourceType,
        dpr
      )

      if (responseDetails) {
        const key = `${details.tabId}:${activeTab.url}`
        responseDetails.key = key

        // Save request details to the service worker application IndexedDB database
        await saveNetworkTraffic({
          ...responseDetails,
          method,
          type: responseDetails.resourceType,
        })

        const options = {
          hostingOptions: {
            verbose: true,
            forceGreen: true,
          },
        }

        // Retrieve processed request data
        const { bytes, count, greenHosting, mgCO2, emissions, data } =
          await getNetworkTraffic(key, initiator, options)

        sendMessageToSidePanel({
          url: activeTab.url,
          bytes,
          count,
          greenHosting,
          mgCO2,
          emissions,
          data,
          status: response.status,
          type,
        })
      } else {
        if (response.status !== 200) {
          sendMessageToSidePanel({
            url: response.url,
            bytes: 0,
            count: 0,
            greenHosting: false,
            mgCO2: 0,
            emissions: 0,
            data: null,
            status: response.status,
            type,
          })
        }
      }
    }
  }
}

function toggleWebRequestListener(isPanelVisible) {
  // If the side panel is open and we don't have a web request listener
  if (isPanelVisible && !webRequestListener) {
    // Enable (add) a new listener
    webRequestListener = handleRequest // Assign the function reference

    chrome.webRequest.onCompleted.addListener(webRequestListener, {
      urls: ['<all_urls>'],
    })
    console.log('Web request listener enabled (added)')
    // If the side panel is hidden and we already have a listener set up
  } else if (!isPanelVisible && webRequestListener) {
    // Disable (remove) the listener
    chrome.webRequest.onCompleted.removeListener(webRequestListener)
    webRequestListener = null // Clear the reference
    console.log('Web request listener disabled (removed)')
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabs) => {
  // Let the side panel know the url has changed or page refreshed
  // So that the side panel display can be reset
  if (changeInfo.url) {
    chrome.runtime.sendMessage({
      action: 'url-changed',
      url: changeInfo.url,
      tabId,
    })
    console.log('The URL changed')
    // If the visitor changes the URL in the current tab, clear the db
    clearNetworkTraffic()
  } else if (changeInfo?.status === 'loading') {
    chrome.runtime.sendMessage({
      action: 'url-reloaded',
      url: tabs.url,
      tabId,
    })
    console.log('The URL was reloaded (page refresh)')
  }
})

// We listen to changes in the side panel:
chrome.runtime.onMessage.addListener((message) => {
  // The side has been loaded
  if (message.type === 'side-panel-dom-loaded') {
    // dpr is a property of window which side panel has access to
    dpr = message.dpr
  }
  // The visitor wants to reset
  if (message.type === 'reset-emissions') {
    clearNetworkTraffic()
  }
})

// When the visitor moves to a different tab, we clear the db and close the side panel
chrome.tabs.onActivated.addListener(() => {
  // We stop listening for requests
  toggleWebRequestListener(false)
  // Clear the db
  clearNetworkTraffic()
  // Close the side panel
  closeSidePanel()
  // And set panel closed to true
  isSidePanelOpen = false
})

</document_content>
</document>
<document index="5">
<source>./publish/background\utils.js</source>
<document_content>
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

    const props = requests.map((r) => {
      return {
        url: r.url,
        bytes: r.bytes,
        uncompressedBytes: r.uncompressedBytes,
        contentType: r.contentType,
        method: r.method,
        encoding: r.encoding,
      }
    })

    // If the type is not already in the object, initialize it as an array
    if (!groupedRequests[type]) {
      groupedRequests[type] = []
    }

    // Append the requests to the corresponding type
    groupedRequests[type].push(...props)
  })

  return groupedRequests
}

export const toggleNotification = (
  textElement,
  className = 'notification',
  delay = 2000
) => {
  textElement.classList.remove(className)
  setTimeout(() => {
    textElement.classList.add(className)
  }, delay)
}

</document_content>
</document>
<document index="6">
<source>./publish/background\tgwf\1byte.js</source>
<document_content>
const CO2_PER_KWH_IN_DC_GREY = 519;
const CO2_PER_KWH_NETWORK_GREY = 475;
const CO2_PER_KWH_IN_DC_GREEN = 0;
const KWH_PER_BYTE_IN_DC = 72e-12;
const FIXED_NETWORK_WIRED = 429e-12;
const FIXED_NETWORK_WIFI = 152e-12;
const FOUR_G_MOBILE = 884e-12;
const KWH_PER_BYTE_FOR_NETWORK = (FIXED_NETWORK_WIRED + FIXED_NETWORK_WIFI + FOUR_G_MOBILE) / 3;
const KWH_PER_BYTE_FOR_DEVICES = 13e-11;
class OneByte {
  constructor(options) {
    this.allowRatings = false;
    this.options = options;
    this.KWH_PER_BYTE_FOR_NETWORK = KWH_PER_BYTE_FOR_NETWORK;
  }
  perByte(bytes, green) {
    if (bytes < 1) {
      return 0;
    }
    if (green) {
      const Co2ForDC = bytes * KWH_PER_BYTE_IN_DC * CO2_PER_KWH_IN_DC_GREEN;
      const Co2forNetwork = bytes * KWH_PER_BYTE_FOR_NETWORK * CO2_PER_KWH_NETWORK_GREY;
      return Co2ForDC + Co2forNetwork;
    }
    const KwHPerByte = KWH_PER_BYTE_IN_DC + KWH_PER_BYTE_FOR_NETWORK;
    return bytes * KwHPerByte * CO2_PER_KWH_IN_DC_GREY;
  }
}
var byte_default = OneByte;
export {
  OneByte,
  byte_default as default
};

</document_content>
</document>
<document index="7">
<source>./publish/background\tgwf\co2.js</source>
<document_content>
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import OneByte from "./1byte.js";
import SustainableWebDesignV3 from "./sustainable-web-design-v3.js";
import SustainableWebDesignV4 from "./sustainable-web-design-v4.js";
import {
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY
} from "./constants/index.js";
import { parseOptions } from "./helpers/index.js";
class CO2 {
  constructor(options) {
    this.model = new SustainableWebDesignV3();
    if ((options == null ? void 0 : options.model) === "1byte") {
      this.model = new OneByte();
    } else if ((options == null ? void 0 : options.model) === "swd") {
      this.model = new SustainableWebDesignV3();
      if ((options == null ? void 0 : options.version) === 4) {
        this.model = new SustainableWebDesignV4();
      }
    } else if (options == null ? void 0 : options.model) {
      throw new Error(`"${options.model}" is not a valid model. Please use "1byte" for the OneByte model, and "swd" for the Sustainable Web Design model.
See https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`);
    }
    if ((options == null ? void 0 : options.rating) && typeof options.rating !== "boolean") {
      throw new Error(`The rating option must be a boolean. Please use true or false.
See https://developers.thegreenwebfoundation.org/co2js/options/ to learn more about the options available in CO2.js.`);
    }
    const allowRatings = !!this.model.allowRatings;
    this._segment = (options == null ? void 0 : options.results) === "segment";
    this._rating = (options == null ? void 0 : options.rating) === true;
    if (!allowRatings && this._rating) {
      throw new Error(`The rating system is not supported in the model you are using. Try using the Sustainable Web Design model instead.
See https://developers.thegreenwebfoundation.org/co2js/models/ to learn more about the models available in CO2.js.`);
    }
  }
  perByte(bytes, green = false) {
    return this.model.perByte(bytes, green, this._segment, this._rating);
  }
  perVisit(bytes, green = false) {
    var _a;
    if ((_a = this.model) == null ? void 0 : _a.perVisit) {
      return this.model.perVisit(bytes, green, this._segment, this._rating);
    } else {
      throw new Error(`The perVisit() method is not supported in the model you are using. Try using perByte() instead.
See https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`);
    }
  }
  perByteTrace(bytes, green = false, options = {}) {
    const adjustments = parseOptions(options, this.model.version, green);
    const _a = adjustments, { gridIntensity } = _a, traceVariables = __objRest(_a, ["gridIntensity"]);
    const _b = traceVariables, {
      dataReloadRatio,
      firstVisitPercentage,
      returnVisitPercentage
    } = _b, otherVariables = __objRest(_b, [
      "dataReloadRatio",
      "firstVisitPercentage",
      "returnVisitPercentage"
    ]);
    return {
      co2: this.model.perByte(bytes, green, this._segment, this._rating, adjustments),
      green,
      variables: __spreadValues({
        description: "Below are the variables used to calculate this CO2 estimate.",
        bytes,
        gridIntensity: __spreadValues({
          description: "The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate."
        }, adjustments.gridIntensity)
      }, otherVariables)
    };
  }
  perVisitTrace(bytes, green = false, options = {}) {
    var _a;
    if ((_a = this.model) == null ? void 0 : _a.perVisit) {
      const adjustments = parseOptions(options, this.model.version, green);
      const _b = adjustments, { gridIntensity } = _b, variables = __objRest(_b, ["gridIntensity"]);
      return {
        co2: this.model.perVisit(bytes, green, this._segment, this._rating, adjustments),
        green,
        variables: __spreadValues({
          description: "Below are the variables used to calculate this CO2 estimate.",
          bytes,
          gridIntensity: __spreadValues({
            description: "The grid intensity (grams per kilowatt-hour) used to calculate this CO2 estimate."
          }, adjustments.gridIntensity)
        }, variables)
      };
    } else {
      throw new Error(`The perVisitTrace() method is not supported in the model you are using. Try using perByte() instead.
See https://developers.thegreenwebfoundation.org/co2js/methods/ to learn more about the methods available in CO2.js.`);
    }
  }
  SustainableWebDesignV3() {
    return new SustainableWebDesignV3();
  }
  SustainableWebDesignV4() {
    return new SustainableWebDesignV4();
  }
  OneByte() {
    return new OneByte();
  }
}
var co2_default = CO2;
export {
  CO2,
  co2_default as default
};

</document_content>
</document>
<document index="8">
<source>./publish/background\tgwf\hosting-api.js</source>
<document_content>
"use strict";
import { getApiRequestHeaders } from "./helpers/index.js";
import hostingJSON from "./hosting-json.js";
function check(domain, optionsOrAgentId) {
  const options = typeof optionsOrAgentId === "string" ? { userAgentIdentifier: optionsOrAgentId } : optionsOrAgentId;
  if ((options == null ? void 0 : options.db) && options.verbose) {
    throw new Error("verbose mode cannot be used with a local lookup database");
  }
  if (typeof domain === "string") {
    return checkAgainstAPI(domain, options);
  } else {
    return checkDomainsAgainstAPI(domain, options);
  }
}
async function checkAgainstAPI(domain, options = {}) {
  const req = await fetch(`https://api.thegreenwebfoundation.org/greencheck/${domain}`, {
    headers: getApiRequestHeaders(options.userAgentIdentifier)
  });
  if (options == null ? void 0 : options.db) {
    return hostingJSON.check(domain, options.db);
  }
  const res = await req.json();
  return options.verbose ? res : res.green;
}
async function checkDomainsAgainstAPI(domains, options = {}) {
  try {
    const apiPath = "https://api.thegreenwebfoundation.org/v2/greencheckmulti";
    const domainsString = JSON.stringify(domains);
    const req = await fetch(`${apiPath}/${domainsString}`, {
      headers: getApiRequestHeaders(options.userAgentIdentifier)
    });
    const allGreenCheckResults = await req.json();
    return options.verbose ? allGreenCheckResults : greenDomainsFromResults(allGreenCheckResults);
  } catch (e) {
    return options.verbose ? {} : [];
  }
}
function greenDomainsFromResults(greenResults) {
  const entries = Object.entries(greenResults);
  const greenEntries = entries.filter(([key, val]) => val.green);
  return greenEntries.map(([key, val]) => val.url);
}
var hosting_api_default = {
  check
};
export {
  hosting_api_default as default
};

</document_content>
</document>
<document index="9">
<source>./publish/background\tgwf\hosting-json.js</source>
<document_content>
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_hosting_json = __commonJS({
  "src/hosting-json.js"(exports, module) {
    async function check(domain, db) {
      if (typeof domain === "string") {
        return checkInJSON(domain, db);
      } else {
        return checkDomainsInJSON(domain, db);
      }
    }
    function checkInJSON(domain, db) {
      if (db.indexOf(domain) > -1) {
        return true;
      }
      return false;
    }
    function greenDomainsFromResults(greenResults) {
      const entries = Object.entries(greenResults);
      const greenEntries = entries.filter(([key, val]) => val.green);
      return greenEntries.map(([key, val]) => val.url);
    }
    function checkDomainsInJSON(domains, db) {
      let greenDomains = [];
      for (let domain of domains) {
        if (db.indexOf(domain) > -1) {
          greenDomains.push(domain);
        }
      }
      return greenDomains;
    }
    function find(domain, db) {
      if (typeof domain === "string") {
        return findInJSON(domain, db);
      } else {
        return findDomainsInJSON(domain, db);
      }
    }
    function findInJSON(domain, db) {
      if (db.indexOf(domain) > -1) {
        return domain;
      }
      return {
        url: domain,
        green: false
      };
    }
    function findDomainsInJSON(domains, db) {
      const result = {};
      for (let domain of domains) {
        result[domain] = findInJSON(domain, db);
      }
      return result;
    }
    module.exports = {
      check,
      greenDomainsFromResults,
      find
    };
  }
});
export default require_hosting_json();

</document_content>
</document>
<document index="10">
<source>./publish/background\tgwf\hosting.js</source>
<document_content>
"use strict";
import hostingAPI from "./hosting-api.js";
function check(domain, optionsOrAgentId) {
  return hostingAPI.check(domain, optionsOrAgentId);
}
var hosting_default = check;
export {
  hosting_default as default
};

</document_content>
</document>
<document index="11">
<source>./publish/background\tgwf\index.js</source>
<document_content>
import co2 from "./co2.js";
import hosting from "./hosting.js";
import averageIntensity from "./data/average-intensities.min.js";
import marginalIntensity from "./data/marginal-intensities-2021.min.js";
var src_default = { co2, hosting, averageIntensity, marginalIntensity };
export {
  averageIntensity,
  co2,
  src_default as default,
  hosting,
  marginalIntensity
};

</document_content>
</document>
<document index="12">
<source>./publish/background\tgwf\package.json</source>
<document_content>
{
    "type": "module"
}

</document_content>
</document>
<document index="13">
<source>./publish/background\tgwf\sustainable-web-design-v3.js</source>
<document_content>
"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import {
  fileSize,
  KWH_PER_GB,
  END_USER_DEVICE_ENERGY,
  NETWORK_ENERGY,
  DATACENTER_ENERGY,
  PRODUCTION_ENERGY,
  GLOBAL_GRID_INTENSITY,
  RENEWABLES_GRID_INTENSITY,
  FIRST_TIME_VIEWING_PERCENTAGE,
  RETURNING_VISITOR_PERCENTAGE,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD
} from "./constants/index.js";
import { formatNumber, outputRating } from "./helpers/index.js";
class SustainableWebDesign {
  constructor(options) {
    this.allowRatings = true;
    this.options = options;
    this.version = 3;
  }
  energyPerByteByComponent(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const energyUsage = transferedBytesToGb * KWH_PER_GB;
    return {
      consumerDeviceEnergy: energyUsage * END_USER_DEVICE_ENERGY,
      networkEnergy: energyUsage * NETWORK_ENERGY,
      productionEnergy: energyUsage * PRODUCTION_ENERGY,
      dataCenterEnergy: energyUsage * DATACENTER_ENERGY
    };
  }
  co2byComponent(energyByComponent, carbonIntensity = GLOBAL_GRID_INTENSITY, options = {}) {
    let deviceCarbonIntensity = GLOBAL_GRID_INTENSITY;
    let networkCarbonIntensity = GLOBAL_GRID_INTENSITY;
    let dataCenterCarbonIntensity = GLOBAL_GRID_INTENSITY;
    let globalEmissions = GLOBAL_GRID_INTENSITY;
    if (options == null ? void 0 : options.gridIntensity) {
      const { device, network, dataCenter } = options.gridIntensity;
      if ((device == null ? void 0 : device.value) || (device == null ? void 0 : device.value) === 0) {
        deviceCarbonIntensity = device.value;
      }
      if ((network == null ? void 0 : network.value) || (network == null ? void 0 : network.value) === 0) {
        networkCarbonIntensity = network.value;
      }
      if ((dataCenter == null ? void 0 : dataCenter.value) || (dataCenter == null ? void 0 : dataCenter.value) === 0) {
        dataCenterCarbonIntensity = dataCenter.value;
      }
    }
    if (carbonIntensity === true) {
      dataCenterCarbonIntensity = RENEWABLES_GRID_INTENSITY;
    }
    const returnCO2ByComponent = {};
    for (const [key, value] of Object.entries(energyByComponent)) {
      if (key.startsWith("dataCenterEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] = value * dataCenterCarbonIntensity;
      } else if (key.startsWith("consumerDeviceEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] = value * deviceCarbonIntensity;
      } else if (key.startsWith("networkEnergy")) {
        returnCO2ByComponent[key.replace("Energy", "CO2")] = value * networkCarbonIntensity;
      } else {
        returnCO2ByComponent[key.replace("Energy", "CO2")] = value * globalEmissions;
      }
    }
    return returnCO2ByComponent;
  }
  perByte(bytes, carbonIntensity = false, segmentResults = false, ratingResults = false, options = {}) {
    if (bytes < 1) {
      bytes = 0;
    }
    const energyBycomponent = this.energyPerByteByComponent(bytes, options);
    if (typeof carbonIntensity !== "boolean") {
      throw new Error(`perByte expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`);
    }
    const co2ValuesbyComponent = this.co2byComponent(energyBycomponent, carbonIntensity, options);
    const co2Values = Object.values(co2ValuesbyComponent);
    const co2ValuesSum = co2Values.reduce((prevValue, currentValue) => prevValue + currentValue);
    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(co2ValuesSum);
    }
    if (segmentResults) {
      if (ratingResults) {
        return __spreadProps(__spreadValues({}, co2ValuesbyComponent), {
          total: co2ValuesSum,
          rating
        });
      }
      return __spreadProps(__spreadValues({}, co2ValuesbyComponent), { total: co2ValuesSum });
    }
    if (ratingResults) {
      return { total: co2ValuesSum, rating };
    }
    return co2ValuesSum;
  }
  perVisit(bytes, carbonIntensity = false, segmentResults = false, ratingResults = false, options = {}) {
    const energyBycomponent = this.energyPerVisitByComponent(bytes, options);
    if (typeof carbonIntensity !== "boolean") {
      throw new Error(`perVisit expects a boolean for the carbon intensity value. Received: ${carbonIntensity}`);
    }
    const co2ValuesbyComponent = this.co2byComponent(energyBycomponent, carbonIntensity, options);
    const co2Values = Object.values(co2ValuesbyComponent);
    const co2ValuesSum = co2Values.reduce((prevValue, currentValue) => prevValue + currentValue);
    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(co2ValuesSum);
    }
    if (segmentResults) {
      if (ratingResults) {
        return __spreadProps(__spreadValues({}, co2ValuesbyComponent), {
          total: co2ValuesSum,
          rating
        });
      }
      return __spreadProps(__spreadValues({}, co2ValuesbyComponent), { total: co2ValuesSum });
    }
    if (ratingResults) {
      return { total: co2ValuesSum, rating };
    }
    return co2ValuesSum;
  }
  energyPerByte(bytes) {
    const energyByComponent = this.energyPerByteByComponent(bytes);
    const energyValues = Object.values(energyByComponent);
    return energyValues.reduce((prevValue, currentValue) => prevValue + currentValue);
  }
  energyPerVisitByComponent(bytes, options = {}, firstView = FIRST_TIME_VIEWING_PERCENTAGE, returnView = RETURNING_VISITOR_PERCENTAGE, dataReloadRatio = PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD) {
    if (options.dataReloadRatio || options.dataReloadRatio === 0) {
      dataReloadRatio = options.dataReloadRatio;
    }
    if (options.firstVisitPercentage || options.firstVisitPercentage === 0) {
      firstView = options.firstVisitPercentage;
    }
    if (options.returnVisitPercentage || options.returnVisitPercentage === 0) {
      returnView = options.returnVisitPercentage;
    }
    const energyBycomponent = this.energyPerByteByComponent(bytes);
    const cacheAdjustedSegmentEnergy = {};
    const energyValues = Object.values(energyBycomponent);
    for (const [key, value] of Object.entries(energyBycomponent)) {
      cacheAdjustedSegmentEnergy[`${key} - first`] = value * firstView;
      cacheAdjustedSegmentEnergy[`${key} - subsequent`] = value * returnView * dataReloadRatio;
    }
    return cacheAdjustedSegmentEnergy;
  }
  energyPerVisit(bytes) {
    let firstVisits = 0;
    let subsequentVisits = 0;
    const energyBycomponent = Object.entries(this.energyPerVisitByComponent(bytes));
    for (const [key, val] of energyBycomponent) {
      if (key.indexOf("first") > 0) {
        firstVisits += val;
      }
    }
    for (const [key, val] of energyBycomponent) {
      if (key.indexOf("subsequent") > 0) {
        subsequentVisits += val;
      }
    }
    return firstVisits + subsequentVisits;
  }
  emissionsPerVisitInGrams(energyPerVisit, carbonintensity = GLOBAL_GRID_INTENSITY) {
    return formatNumber(energyPerVisit * carbonintensity);
  }
  annualEnergyInKwh(energyPerVisit, monthlyVisitors = 1e3) {
    return energyPerVisit * monthlyVisitors * 12;
  }
  annualEmissionsInGrams(co2grams, monthlyVisitors = 1e3) {
    return co2grams * monthlyVisitors * 12;
  }
  annualSegmentEnergy(annualEnergy) {
    return {
      consumerDeviceEnergy: formatNumber(annualEnergy * END_USER_DEVICE_ENERGY),
      networkEnergy: formatNumber(annualEnergy * NETWORK_ENERGY),
      dataCenterEnergy: formatNumber(annualEnergy * DATACENTER_ENERGY),
      productionEnergy: formatNumber(annualEnergy * PRODUCTION_ENERGY)
    };
  }
  ratingScale(co2e) {
    return outputRating(co2e, this.version);
  }
}
var sustainable_web_design_v3_default = SustainableWebDesign;
export {
  SustainableWebDesign,
  sustainable_web_design_v3_default as default
};

</document_content>
</document>
<document index="14">
<source>./publish/background\tgwf\sustainable-web-design-v4.js</source>
<document_content>
"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { fileSize, SWDV4 } from "./constants/index.js";
import { outputRating } from "./helpers/index.js";
const {
  OPERATIONAL_KWH_PER_GB_DATACENTER,
  OPERATIONAL_KWH_PER_GB_NETWORK,
  OPERATIONAL_KWH_PER_GB_DEVICE,
  EMBODIED_KWH_PER_GB_DATACENTER,
  EMBODIED_KWH_PER_GB_NETWORK,
  EMBODIED_KWH_PER_GB_DEVICE,
  GLOBAL_GRID_INTENSITY
} = SWDV4;
function outputSegments(operationalEmissions, embodiedEmissions) {
  const totalOperationalCO2e = operationalEmissions.dataCenter + operationalEmissions.network + operationalEmissions.device;
  const totalEmbodiedCO2e = embodiedEmissions.dataCenter + embodiedEmissions.network + embodiedEmissions.device;
  const dataCenterCO2e = operationalEmissions.dataCenter + embodiedEmissions.dataCenter;
  const networkCO2e = operationalEmissions.network + embodiedEmissions.network;
  const consumerDeviceCO2e = operationalEmissions.device + embodiedEmissions.device;
  return {
    dataCenterOperationalCO2e: operationalEmissions.dataCenter,
    networkOperationalCO2e: operationalEmissions.network,
    consumerDeviceOperationalCO2e: operationalEmissions.device,
    dataCenterEmbodiedCO2e: embodiedEmissions.dataCenter,
    networkEmbodiedCO2e: embodiedEmissions.network,
    consumerDeviceEmbodiedCO2e: embodiedEmissions.device,
    totalEmbodiedCO2e,
    totalOperationalCO2e,
    dataCenterCO2e,
    networkCO2e,
    consumerDeviceCO2e
  };
}
function getGreenHostingFactor(green, options) {
  if (green) {
    return 1;
  } else if ((options == null ? void 0 : options.greenHostingFactor) || (options == null ? void 0 : options.greenHostingFactor) === 0) {
    return options.greenHostingFactor;
  }
  return 0;
}
class SustainableWebDesign {
  constructor(options) {
    this.allowRatings = true;
    this.options = options;
    this.version = 4;
  }
  operationalEnergyPerSegment(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const dataCenter = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_DATACENTER;
    const network = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_NETWORK;
    const device = transferedBytesToGb * OPERATIONAL_KWH_PER_GB_DEVICE;
    return {
      dataCenter,
      network,
      device
    };
  }
  operationalEmissions(bytes, options = {}) {
    const { dataCenter, network, device } = this.operationalEnergyPerSegment(bytes);
    let dataCenterGridIntensity = GLOBAL_GRID_INTENSITY;
    let networkGridIntensity = GLOBAL_GRID_INTENSITY;
    let deviceGridIntensity = GLOBAL_GRID_INTENSITY;
    if (options == null ? void 0 : options.gridIntensity) {
      const { device: device2, network: network2, dataCenter: dataCenter2 } = options.gridIntensity;
      if ((device2 == null ? void 0 : device2.value) || (device2 == null ? void 0 : device2.value) === 0) {
        deviceGridIntensity = device2.value;
      }
      if ((network2 == null ? void 0 : network2.value) || (network2 == null ? void 0 : network2.value) === 0) {
        networkGridIntensity = network2.value;
      }
      if ((dataCenter2 == null ? void 0 : dataCenter2.value) || (dataCenter2 == null ? void 0 : dataCenter2.value) === 0) {
        dataCenterGridIntensity = dataCenter2.value;
      }
    }
    const dataCenterEmissions = dataCenter * dataCenterGridIntensity;
    const networkEmissions = network * networkGridIntensity;
    const deviceEmissions = device * deviceGridIntensity;
    return {
      dataCenter: dataCenterEmissions,
      network: networkEmissions,
      device: deviceEmissions
    };
  }
  embodiedEnergyPerSegment(bytes) {
    const transferedBytesToGb = bytes / fileSize.GIGABYTE;
    const dataCenter = transferedBytesToGb * EMBODIED_KWH_PER_GB_DATACENTER;
    const network = transferedBytesToGb * EMBODIED_KWH_PER_GB_NETWORK;
    const device = transferedBytesToGb * EMBODIED_KWH_PER_GB_DEVICE;
    return {
      dataCenter,
      network,
      device
    };
  }
  embodiedEmissions(bytes) {
    const { dataCenter, network, device } = this.embodiedEnergyPerSegment(bytes);
    const dataCenterGridIntensity = GLOBAL_GRID_INTENSITY;
    const networkGridIntensity = GLOBAL_GRID_INTENSITY;
    const deviceGridIntensity = GLOBAL_GRID_INTENSITY;
    const dataCenterEmissions = dataCenter * dataCenterGridIntensity;
    const networkEmissions = network * networkGridIntensity;
    const deviceEmissions = device * deviceGridIntensity;
    return {
      dataCenter: dataCenterEmissions,
      network: networkEmissions,
      device: deviceEmissions
    };
  }
  perByte(bytes, green = false, segmented = false, ratingResults = false, options = {}) {
    if (bytes < 1) {
      return 0;
    }
    const operationalEmissions = this.operationalEmissions(bytes, options);
    const embodiedEmissions = this.embodiedEmissions(bytes);
    const greenHostingFactor = getGreenHostingFactor(green, options);
    const totalEmissions = {
      dataCenter: operationalEmissions.dataCenter * (1 - greenHostingFactor) + embodiedEmissions.dataCenter,
      network: operationalEmissions.network + embodiedEmissions.network,
      device: operationalEmissions.device + embodiedEmissions.device
    };
    const total = totalEmissions.dataCenter + totalEmissions.network + totalEmissions.device;
    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(total);
    }
    if (segmented) {
      const segments = __spreadValues({}, outputSegments(operationalEmissions, embodiedEmissions));
      if (ratingResults) {
        return __spreadProps(__spreadValues({}, segments), {
          total,
          rating
        });
      }
      return __spreadProps(__spreadValues({}, segments), { total });
    }
    if (ratingResults) {
      return { total, rating };
    }
    return total;
  }
  perVisit(bytes, green = false, segmented = false, ratingResults = false, options = {}) {
    let firstViewRatio = 1;
    let returnViewRatio = 0;
    let dataReloadRatio = 0;
    const greenHostingFactor = getGreenHostingFactor(green, options);
    const operationalEmissions = this.operationalEmissions(bytes, options);
    const embodiedEmissions = this.embodiedEmissions(bytes);
    if (bytes < 1) {
      return 0;
    }
    if (options.firstVisitPercentage || options.firstVisitPercentage === 0) {
      firstViewRatio = options.firstVisitPercentage;
    }
    if (options.returnVisitPercentage || options.returnVisitPercentage === 0) {
      returnViewRatio = options.returnVisitPercentage;
    }
    if (options.dataReloadRatio || options.dataReloadRatio === 0) {
      dataReloadRatio = options.dataReloadRatio;
    }
    const firstVisitEmissions = operationalEmissions.dataCenter * (1 - greenHostingFactor) + embodiedEmissions.dataCenter + operationalEmissions.network + embodiedEmissions.network + operationalEmissions.device + embodiedEmissions.device;
    const returnVisitEmissions = (operationalEmissions.dataCenter * (1 - greenHostingFactor) + embodiedEmissions.dataCenter + operationalEmissions.network + embodiedEmissions.network + operationalEmissions.device + embodiedEmissions.device) * (1 - dataReloadRatio);
    const total = firstVisitEmissions * firstViewRatio + returnVisitEmissions * returnViewRatio;
    let rating = null;
    if (ratingResults) {
      rating = this.ratingScale(total);
    }
    if (segmented) {
      const segments = __spreadProps(__spreadValues({}, outputSegments(operationalEmissions, embodiedEmissions)), {
        firstVisitCO2e: firstVisitEmissions,
        returnVisitCO2e: returnVisitEmissions
      });
      if (ratingResults) {
        return __spreadProps(__spreadValues({}, segments), {
          total,
          rating
        });
      }
      return __spreadProps(__spreadValues({}, segments), { total });
    }
    if (ratingResults) {
      return { total, rating };
    }
    return total;
  }
  ratingScale(co2e) {
    return outputRating(co2e, this.version);
  }
}
var sustainable_web_design_v4_default = SustainableWebDesign;
export {
  SustainableWebDesign,
  sustainable_web_design_v4_default as default
};

</document_content>
</document>
<document index="15">
<source>./publish/background\tgwf\constants\file-size.js</source>
<document_content>
const GIGABYTE = 1e3 * 1e3 * 1e3;
var file_size_default = {
  GIGABYTE
};
export {
  GIGABYTE,
  file_size_default as default
};

</document_content>
</document>
<document index="16">
<source>./publish/background\tgwf\constants\index.js</source>
<document_content>
import fileSize from "./file-size.js";
import averageIntensity from "../data/average-intensities.min.js";
const KWH_PER_GB = 0.81;
const END_USER_DEVICE_ENERGY = 0.52;
const NETWORK_ENERGY = 0.14;
const DATACENTER_ENERGY = 0.15;
const PRODUCTION_ENERGY = 0.19;
const GLOBAL_GRID_INTENSITY = averageIntensity.data["WORLD"];
const RENEWABLES_GRID_INTENSITY = 50;
const FIRST_TIME_VIEWING_PERCENTAGE = 0.75;
const RETURNING_VISITOR_PERCENTAGE = 0.25;
const PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD = 0.02;
const SWDV4 = {
  OPERATIONAL_KWH_PER_GB_DATACENTER: 0.055,
  OPERATIONAL_KWH_PER_GB_NETWORK: 0.059,
  OPERATIONAL_KWH_PER_GB_DEVICE: 0.08,
  EMBODIED_KWH_PER_GB_DATACENTER: 0.012,
  EMBODIED_KWH_PER_GB_NETWORK: 0.013,
  EMBODIED_KWH_PER_GB_DEVICE: 0.081,
  GLOBAL_GRID_INTENSITY: 494
};
const SWDMV3_RATINGS = {
  FIFTH_PERCENTILE: 0.095,
  TENTH_PERCENTILE: 0.186,
  TWENTIETH_PERCENTILE: 0.341,
  THIRTIETH_PERCENTILE: 0.493,
  FORTIETH_PERCENTILE: 0.656,
  FIFTIETH_PERCENTILE: 0.846
};
const SWDMV4_RATINGS = {
  FIFTH_PERCENTILE: 0.04,
  TENTH_PERCENTILE: 0.079,
  TWENTIETH_PERCENTILE: 0.145,
  THIRTIETH_PERCENTILE: 0.209,
  FORTIETH_PERCENTILE: 0.278,
  FIFTIETH_PERCENTILE: 0.359
};
export {
  DATACENTER_ENERGY,
  END_USER_DEVICE_ENERGY,
  FIRST_TIME_VIEWING_PERCENTAGE,
  GLOBAL_GRID_INTENSITY,
  KWH_PER_GB,
  NETWORK_ENERGY,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD,
  PRODUCTION_ENERGY,
  RENEWABLES_GRID_INTENSITY,
  RETURNING_VISITOR_PERCENTAGE,
  SWDMV3_RATINGS,
  SWDMV4_RATINGS,
  SWDV4,
  fileSize
};

</document_content>
</document>
<document index="17">
<source>./publish/background\tgwf\data\average-intensities.min.js</source>
<document_content>
const data = { "AFG": 132.53, "AFRICA": 547.83, "ALB": 24.29, "DZA": 634.61, "ASM": 611.11, "AGO": 174.73, "ATG": 611.11, "ARG": 353.96, "ARM": 264.54, "ABW": 561.22, "ASEAN": 570.41, "ASIA": 591.13, "AUS": 556.3, "AUT": 110.81, "AZE": 671.39, "BHS": 660.1, "BHR": 904.62, "BGD": 691.41, "BRB": 605.51, "BLR": 441.74, "BEL": 138.11, "BLZ": 225.81, "BEN": 584.07, "BTN": 23.33, "BOL": 531.69, "BIH": 601.29, "BWA": 847.91, "BRA": 96.4, "BRN": 893.91, "BGR": 335.33, "BFA": 467.53, "BDI": 250, "CPV": 558.14, "KHM": 417.71, "CMR": 305.42, "CAN": 165.15, "CYM": 642.86, "CAF": 0, "TCD": 628.57, "CHL": 291.11, "CHN": 583.61, "COL": 259.51, "COM": 642.86, "COG": 700, "COD": 24.46, "COK": 250, "CRI": 53.38, "CIV": 393.89, "HRV": 204.96, "CUB": 637.61, "CYP": 534.32, "CZE": 449.72, "DNK": 151.65, "DJI": 692.31, "DMA": 529.41, "DOM": 580.78, "ECU": 166.91, "EGY": 574.04, "SLV": 224.76, "GNQ": 591.84, "ERI": 631.58, "EST": 416.67, "SWZ": 172.41, "ETH": 24.64, "EU": 243.93, "EUROPE": 302.29, "FLK": 500, "FRO": 404.76, "FJI": 288.46, "FIN": 79.16, "FRA": 56.02, "GUF": 217.82, "PYF": 442.86, "G20": 477.89, "G7": 341.44, "GAB": 491.6, "GMB": 666.67, "GEO": 167.59, "DEU": 381.41, "GHA": 484, "GRC": 336.57, "GRL": 178.57, "GRD": 640, "GLP": 500, "GUM": 622.86, "GTM": 328.27, "GIN": 236.84, "GNB": 625, "GUY": 640.35, "HTI": 567.31, "HND": 282.27, "HKG": 699.5, "HUN": 204.19, "ISL": 27.68, "IND": 713.01, "IDN": 682.43, "IRN": 641.73, "IRQ": 688.81, "IRL": 282.98, "ISR": 582.93, "ITA": 330.72, "JAM": 555.56, "JPN": 493.59, "JOR": 540.92, "KAZ": 821.9, "KEN": 71.2, "KIR": 666.67, "XKX": 894.65, "KWT": 649.16, "KGZ": 147.29, "LAO": 265.51, "LATIN AMERICA AND CARIBBEAN": 256.03, "LVA": 123.99, "LBN": 599.01, "LSO": 20, "LBR": 227.85, "LBY": 818.69, "LTU": 160.07, "LUX": 105.26, "MAC": 448.98, "MDG": 436.44, "MWI": 66.67, "MYS": 607.88, "MDV": 611.77, "MLI": 408, "MLT": 459.14, "MTQ": 523.18, "MRT": 464.71, "MUS": 632.48, "MEX": 492.34, "MIDDLE EAST": 643.04, "MDA": 643.46, "MNG": 775.31, "MNE": 418.09, "MSR": 1e3, "MAR": 624.45, "MOZ": 135.65, "MMR": 436.92, "NAM": 59.26, "NRU": 750, "NPL": 24.44, "NLD": 268.48, "NCL": 660.58, "NZL": 112.76, "NIC": 265.12, "NER": 670.89, "NGA": 523.25, "NORTH AMERICA": 342.95, "PRK": 389.59, "MKD": 556.19, "NOR": 30.05, "OCEANIA": 495.74, "OECD": 341.27, "OMN": 564.55, "PAK": 440.61, "PSE": 516.13, "PAN": 161.68, "PNG": 507.25, "PRY": 24.31, "PER": 266.48, "POL": 661.93, "PRT": 165.55, "PRI": 677.96, "QAT": 602.5, "REU": 572.82, "ROU": 240.58, "RUS": 445.02, "RWA": 316.33, "KNA": 636.36, "LCA": 666.67, "SPM": 600, "VCT": 529.41, "WSM": 473.68, "STP": 642.86, "SAU": 696.31, "SEN": 511.6, "SRB": 647.52, "SYC": 564.52, "SLE": 50, "SGP": 470.78, "SVK": 116.77, "SVN": 231.28, "SLB": 700, "SOM": 578.95, "ZAF": 709.69, "KOR": 432.11, "SSD": 629.03, "ESP": 174.05, "LKA": 509.78, "SDN": 263.16, "SUR": 349.28, "SWE": 40.7, "CHE": 34.68, "SYR": 701.66, "TWN": 644.36, "TJK": 116.86, "TZA": 339.25, "THA": 549.85, "PHL": 610.74, "TGO": 443.18, "TON": 625, "TTO": 681.53, "TUN": 563.96, "TUR": 464.59, "TKM": 1306.03, "TCA": 653.85, "UGA": 44.53, "UKR": 256.21, "ARE": 492.7, "GBR": 228.25, "USA": 369.47, "URY": 128.79, "UZB": 1167.6, "VUT": 571.43, "VEN": 185.8, "VNM": 472.47, "VGB": 647.06, "VIR": 632.35, "WORLD": 481.65, "YEM": 566.1, "ZMB": 111.97, "ZWE": 297.87 };
const type = "average";
var average_intensities_min_default = { data, type };
export {
  data,
  average_intensities_min_default as default,
  type
};

</document_content>
</document>
<document index="18">
<source>./publish/background\tgwf\data\marginal-intensities-2021.min.js</source>
<document_content>
const data = { "AFG": "414", "ALB": "0", "DZA": "528", "ASM": "753", "AND": "188", "AGO": "1476", "AIA": "753", "ATG": "753", "ARG": "478", "ARM": "390", "ABW": "753", "AUS": "808", "AUT": "242", "AZE": "534", "AZORES (PORTUGAL)": "753", "BHS": "753", "BHR": "726", "BGD": "528", "BRB": "749", "BLR": "400", "BEL": "252", "BLZ": "403", "BEN": "745", "BMU": "753", "BTN": "0", "BOL": "604", "BES": "753", "BIH": "1197", "BWA": "1486", "BRA": "284", "VGB": "753", "BRN": "681", "BGR": "911", "BFA": "753", "BDI": "414", "KHM": "1046", "CMR": "659", "CAN": "372", "CYM": "753", "CPV": "753", "CAF": "188", "TCD": "753", "CHANNEL ISLANDS (U.K)": "753", "CHL": "657", "CHN": "899", "COL": "410", "COM": "753", "COD": "0", "COG": "659", "COK": "753", "CRI": "108", "CIV": "466", "HRV": "294", "CUB": "559", "CUW": "876", "CYP": "751", "CZE": "902", "DNK": "362", "DJI": "753", "DMA": "753", "DOM": "601", "ECU": "560", "EGY": "554", "SLV": "547", "GNQ": "632", "ERI": "915", "EST": "1057", "SWZ": "0", "ETH": "0", "FLK": "753", "FRO": "753", "FJI": "640", "FIN": "267", "FRA": "158", "GUF": "423", "PYF": "753", "GAB": "946", "GMB": "753", "GEO": "289", "DEU": "650", "GHA": "495", "GIB": "779", "GRC": "507", "GRL": "264", "GRD": "753", "GLP": "753", "GUM": "753", "GTM": "798", "GIN": "753", "GNB": "753", "GUY": "847", "HTI": "1048", "HND": "662", "HUN": "296", "ISL": "0", "IND": "951", "IDN": "783", "IRN": "592", "IRQ": "1080", "IRL": "380", "IMN": "436", "ISR": "394", "ITA": "414", "JAM": "711", "JPN": "471", "JOR": "529", "KAZ": "797", "KEN": "574", "KIR": "753", "PRK": "754", "KOR": "555", "XKX": "1145", "KWT": "675", "KGZ": "217", "LAO": "1069", "LVA": "240", "LBN": "794", "LSO": "0", "LBR": "677", "LBY": "668", "LIE": "151", "LTU": "211", "LUX": "220", "MDG": "876", "MADEIRA (PORTUGAL)": "663", "MWI": "489", "MYS": "551", "MDV": "753", "MLI": "1076", "MLT": "520", "MHL": "753", "MTQ": "753", "MRT": "753", "MUS": "700", "MYT": "753", "MEX": "531", "FSM": "753", "MDA": "541", "MCO": "158", "MNG": "1366", "MNE": "899", "MSR": "753", "MAR": "729", "MOZ": "234", "MMR": "719", "NAM": "355", "NRU": "753", "NPL": "0", "NLD": "326", "NCL": "779", "NZL": "246", "NIC": "675", "NER": "772", "NGA": "526", "NIU": "753", "MKD": "851", "MNP": "753", "NOR": "47", "OMN": "479", "PAK": "592", "PLW": "753", "PSE": "719", "PAN": "477", "PNG": "597", "PRY": "0", "PER": "473", "PHL": "672", "POL": "828", "PRT": "389", "PRI": "596", "QAT": "503", "REU": "772", "ROU": "489", "RUS": "476", "RWA": "712", "SHN": "753", "KNA": "753", "LCA": "753", "MAF": "753", "SPM": "753", "VCT": "753", "WSM": "753", "SMR": "414", "STP": "753", "SAU": "592", "SEN": "870", "SRB": "1086", "SYC": "753", "SLE": "489", "SGP": "379", "SXM": "753", "SVK": "332", "SVN": "620", "SLB": "753", "SOM": "753", "ZAF": "1070", "SSD": "890", "ESP": "402", "LKA": "731", "SDN": "736", "SUR": "1029", "SWE": "68", "CHE": "48", "SYR": "713", "TWN": "484", "TJK": "255", "TZA": "531", "THA": "450", "TLS": "753", "TGO": "859", "TON": "753", "TTO": "559", "TUN": "468", "TUR": "376", "TKM": "927", "TCA": "753", "TUV": "753", "UGA": "279", "UKR": "768", "ARE": "556", "GBR": "380", "USA": "416", "URY": "174", "UZB": "612", "VUT": "753", "VEN": "711", "VNM": "560", "VIR": "650", "YEM": "807", "ZMB": "416", "ZWE": "1575", "MEMO:  EU 27": "409" };
const type = "marginal";
const year = "2021";
var marginal_intensities_2021_min_default = { data, type, year };
export {
  data,
  marginal_intensities_2021_min_default as default,
  type,
  year
};

</document_content>
</document>
<document index="19">
<source>./publish/background\tgwf\helpers\index.js</source>
<document_content>
import { averageIntensity } from "../index.js";
import {
  GLOBAL_GRID_INTENSITY as SWDM3_GLOBAL_GRID_INTENSITY,
  SWDV4,
  PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD,
  FIRST_TIME_VIEWING_PERCENTAGE,
  RETURNING_VISITOR_PERCENTAGE,
  SWDMV3_RATINGS,
  SWDMV4_RATINGS
} from "../constants/index.js";
const SWDM4_GLOBAL_GRID_INTENSITY = SWDV4.GLOBAL_GRID_INTENSITY;
const formatNumber = (num) => parseFloat(num.toFixed(2));
const lessThanEqualTo = (num, limit) => num <= limit;
function parseOptions(options = {}, version = 3, green = false) {
  var _a, _b, _c, _d, _e, _f;
  const globalGridIntensity = version === 4 ? SWDM4_GLOBAL_GRID_INTENSITY : SWDM3_GLOBAL_GRID_INTENSITY;
  if (typeof options !== "object") {
    throw new Error("Options must be an object");
  }
  const adjustments = {};
  if (options == null ? void 0 : options.gridIntensity) {
    adjustments.gridIntensity = {};
    const { device, dataCenter, network } = options.gridIntensity;
    if (device || device === 0) {
      if (typeof device === "object") {
        if (!averageIntensity.data[(_a = device.country) == null ? void 0 : _a.toUpperCase()]) {
          console.warn(`"${device.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information. 
Falling back to global average grid intensity.`);
          adjustments.gridIntensity["device"] = {
            value: globalGridIntensity
          };
        }
        adjustments.gridIntensity["device"] = {
          country: device.country,
          value: parseFloat(averageIntensity.data[(_b = device.country) == null ? void 0 : _b.toUpperCase()])
        };
      } else if (typeof device === "number") {
        adjustments.gridIntensity["device"] = {
          value: device
        };
      } else {
        adjustments.gridIntensity["device"] = {
          value: globalGridIntensity
        };
        console.warn(`The device grid intensity must be a number or an object. You passed in a ${typeof device}. 
Falling back to global average grid intensity.`);
      }
    }
    if (dataCenter || dataCenter === 0) {
      if (typeof dataCenter === "object") {
        if (!averageIntensity.data[(_c = dataCenter.country) == null ? void 0 : _c.toUpperCase()]) {
          console.warn(`"${dataCenter.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  
Falling back to global average grid intensity.`);
          adjustments.gridIntensity["dataCenter"] = {
            value: SWDM3_GLOBAL_GRID_INTENSITY
          };
        }
        adjustments.gridIntensity["dataCenter"] = {
          country: dataCenter.country,
          value: parseFloat(averageIntensity.data[(_d = dataCenter.country) == null ? void 0 : _d.toUpperCase()])
        };
      } else if (typeof dataCenter === "number") {
        adjustments.gridIntensity["dataCenter"] = {
          value: dataCenter
        };
      } else {
        adjustments.gridIntensity["dataCenter"] = {
          value: globalGridIntensity
        };
        console.warn(`The data center grid intensity must be a number or an object. You passed in a ${typeof dataCenter}. 
Falling back to global average grid intensity.`);
      }
    }
    if (network || network === 0) {
      if (typeof network === "object") {
        if (!averageIntensity.data[(_e = network.country) == null ? void 0 : _e.toUpperCase()]) {
          console.warn(`"${network.country}" is not a valid country. Please use a valid 3 digit ISO 3166 country code. 
See https://developers.thegreenwebfoundation.org/co2js/data/ for more information.  Falling back to global average grid intensity. 
Falling back to global average grid intensity.`);
          adjustments.gridIntensity["network"] = {
            value: globalGridIntensity
          };
        }
        adjustments.gridIntensity["network"] = {
          country: network.country,
          value: parseFloat(averageIntensity.data[(_f = network.country) == null ? void 0 : _f.toUpperCase()])
        };
      } else if (typeof network === "number") {
        adjustments.gridIntensity["network"] = {
          value: network
        };
      } else {
        adjustments.gridIntensity["network"] = {
          value: globalGridIntensity
        };
        console.warn(`The network grid intensity must be a number or an object. You passed in a ${typeof network}. 
Falling back to global average grid intensity.`);
      }
    }
  } else {
    adjustments.gridIntensity = {
      device: { value: globalGridIntensity },
      dataCenter: { value: globalGridIntensity },
      network: { value: globalGridIntensity }
    };
  }
  if ((options == null ? void 0 : options.dataReloadRatio) || options.dataReloadRatio === 0) {
    if (typeof options.dataReloadRatio === "number") {
      if (options.dataReloadRatio >= 0 && options.dataReloadRatio <= 1) {
        adjustments.dataReloadRatio = options.dataReloadRatio;
      } else {
        adjustments.dataReloadRatio = version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
        console.warn(`The dataReloadRatio option must be a number between 0 and 1. You passed in ${options.dataReloadRatio}. 
Falling back to default value.`);
      }
    } else {
      adjustments.dataReloadRatio = version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
      console.warn(`The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. 
Falling back to default value.`);
    }
  } else {
    adjustments.dataReloadRatio = version === 3 ? PERCENTAGE_OF_DATA_LOADED_ON_SUBSEQUENT_LOAD : 0;
    console.warn(`The dataReloadRatio option must be a number. You passed in a ${typeof options.dataReloadRatio}. 
Falling back to default value.`);
  }
  if ((options == null ? void 0 : options.firstVisitPercentage) || options.firstVisitPercentage === 0) {
    if (typeof options.firstVisitPercentage === "number") {
      if (options.firstVisitPercentage >= 0 && options.firstVisitPercentage <= 1) {
        adjustments.firstVisitPercentage = options.firstVisitPercentage;
      } else {
        adjustments.firstVisitPercentage = version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
        console.warn(`The firstVisitPercentage option must be a number between 0 and 1. You passed in ${options.firstVisitPercentage}. 
Falling back to default value.`);
      }
    } else {
      adjustments.firstVisitPercentage = version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
      console.warn(`The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. 
Falling back to default value.`);
    }
  } else {
    adjustments.firstVisitPercentage = version === 3 ? FIRST_TIME_VIEWING_PERCENTAGE : 1;
    console.warn(`The firstVisitPercentage option must be a number. You passed in a ${typeof options.firstVisitPercentage}. 
Falling back to default value.`);
  }
  if ((options == null ? void 0 : options.returnVisitPercentage) || options.returnVisitPercentage === 0) {
    if (typeof options.returnVisitPercentage === "number") {
      if (options.returnVisitPercentage >= 0 && options.returnVisitPercentage <= 1) {
        adjustments.returnVisitPercentage = options.returnVisitPercentage;
      } else {
        adjustments.returnVisitPercentage = version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
        console.warn(`The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. 
Falling back to default value.`);
      }
    } else {
      adjustments.returnVisitPercentage = version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
      console.warn(`The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. 
Falling back to default value.`);
    }
  } else {
    adjustments.returnVisitPercentage = version === 3 ? RETURNING_VISITOR_PERCENTAGE : 0;
    console.warn(`The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. 
Falling back to default value.`);
  }
  if ((options == null ? void 0 : options.greenHostingFactor) || options.greenHostingFactor === 0 && version === 4) {
    if (typeof options.greenHostingFactor === "number") {
      if (options.greenHostingFactor >= 0 && options.greenHostingFactor <= 1) {
        adjustments.greenHostingFactor = options.greenHostingFactor;
      } else {
        adjustments.greenHostingFactor = 0;
        console.warn(`The returnVisitPercentage option must be a number between 0 and 1. You passed in ${options.returnVisitPercentage}. 
Falling back to default value.`);
      }
    } else {
      adjustments.greenHostingFactor = 0;
      console.warn(`The returnVisitPercentage option must be a number. You passed in a ${typeof options.returnVisitPercentage}. 
Falling back to default value.`);
    }
  } else if (version === 4) {
    adjustments.greenHostingFactor = 0;
  }
  if (green) {
    adjustments.greenHostingFactor = 1;
  }
  return adjustments;
}
function getApiRequestHeaders(comment = "") {
  return { "User-Agent": `co2js/${"0.16.1"} ${comment}` };
}
function outputRating(co2e, swdmVersion) {
  let {
    FIFTH_PERCENTILE,
    TENTH_PERCENTILE,
    TWENTIETH_PERCENTILE,
    THIRTIETH_PERCENTILE,
    FORTIETH_PERCENTILE,
    FIFTIETH_PERCENTILE
  } = SWDMV3_RATINGS;
  if (swdmVersion === 4) {
    FIFTH_PERCENTILE = SWDMV4_RATINGS.FIFTH_PERCENTILE;
    TENTH_PERCENTILE = SWDMV4_RATINGS.TENTH_PERCENTILE;
    TWENTIETH_PERCENTILE = SWDMV4_RATINGS.TWENTIETH_PERCENTILE;
    THIRTIETH_PERCENTILE = SWDMV4_RATINGS.THIRTIETH_PERCENTILE;
    FORTIETH_PERCENTILE = SWDMV4_RATINGS.FORTIETH_PERCENTILE;
    FIFTIETH_PERCENTILE = SWDMV4_RATINGS.FIFTIETH_PERCENTILE;
  }
  if (lessThanEqualTo(co2e, FIFTH_PERCENTILE)) {
    return "A+";
  } else if (lessThanEqualTo(co2e, TENTH_PERCENTILE)) {
    return "A";
  } else if (lessThanEqualTo(co2e, TWENTIETH_PERCENTILE)) {
    return "B";
  } else if (lessThanEqualTo(co2e, THIRTIETH_PERCENTILE)) {
    return "C";
  } else if (lessThanEqualTo(co2e, FORTIETH_PERCENTILE)) {
    return "D";
  } else if (lessThanEqualTo(co2e, FIFTIETH_PERCENTILE)) {
    return "E";
  } else {
    return "F";
  }
}
export {
  formatNumber,
  getApiRequestHeaders,
  lessThanEqualTo,
  outputRating,
  parseOptions
};

</document_content>
</document>
<document index="20">
<source>./publish/side_panel\side-panel.css</source>
<document_content>
:root {
  --bg-colour: white;
  --fg-colour: black;
  --line-colour: lightgrey;
  --accent-colour: orange;
  --up: red;
  --down: green;
  --d: 0.25rem;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  position: relative;
  flex-grow: 1;
  overflow: auto;
  padding: calc(var(--d) * 4);
}

h1 {
  margin-top: 0;
  font-size: 1.1rem;
}

h2 {
  font-size: 1.1rem;
  margin: calc(var(--d) * 8) 0 calc(var(--d) * 4);

  &#requests-by-group {
    margin-bottom: 0;
  }
}

h3 {
  padding-bottom: var(--d);
  border-bottom: 1px solid var(--fg-colour);
  display: inline-block;
  font-weight: 600;
}

button {
  line-height: 1.4;
  padding: calc(var(--d) * 2);
  margin-right: calc(var(--d) * 2);
  border: 1px solid var(--line-colour);
  border-radius: 4px;
  text-wrap: balance;

  &#notification {
    color: var(--fg-colour);
    background-color: var(--accent-colour);
  }
}

button:hover {
  border-color: var(--fg-colour);
  outline: none;
}

button:active {
  box-shadow: 0 0 0 2px var(--fg-colour);
  outline: none;
}

a {
  color: var(--fg-colour);
  text-decoration: underline;
  text-underline-offset: var(--d);
}

dt:not(details *) {
  font-weight: bold;
}

dd {
  margin: calc(var(--d) * 4) 0;
}

section {
  dt::before {
    content: 'url: ';
    font-weight: bold;
  }

  dd {
    & div:first-child::before {
      content: 'kBs: ';
      font-weight: bold;
    }

    & div:last-child::before {
      content: 'uncompressed kBs: ';
      font-weight: bold;
    }
  }
}

dl {
  border-bottom: 1px solid var(--line-colour);
}

section:last-of-type dl {
  border-bottom: none;
}

ul {
  margin-block: 0;
  padding: 0 calc(var(--d) * 4) calc(var(--d) * 4);
  border-bottom: 1px solid var(--line-colour);
}

li {
  list-style-type: square;
  line-height: 1.6;
}

header,
footer {
  position: fixed;
  left: 0;
  width: 100%;
  background-color: var(--bg-colour);
  color: var(--fg-colour);
  padding: calc(var(--d) * 4);
  z-index: 1;
}

header {
  top: 0;
}

footer {
  bottom: 0;
  line-height: 1.8;
}

.hidden {
  display: none;
}

.notification {
  display: none;
}

.up::after {
  content: '\25B2';
  padding-left: 5px;
  padding-left: var(--d);
  color: var(--up);
}

.down::after {
  content: '\25BC';
  padding-left: var(--d);
  color: var(--down);
}

</document_content>
</document>
<document index="21">
<source>./publish/side_panel\side-panel.html</source>
<document_content>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Emissions Tracker by People & Code</title>
    <link rel="stylesheet" href="side-panel.css" />
  </head>
  <body>
    <header>
      <h1>Emissions Tracker</h1>
      <div>Monitor CO<sub>2</sub> emissions associated with web pages.</div>
    </header>
    <main>
      <h2>Summary</h2>
      <dl>
        <dt>Page</dt>
        <dd id="url">-</dd>
        <dt>Requested data in kilobytes</dt>
        <dd id="bytes">-</dd>
        <dt>Number of requests</dt>
        <dd id="request-count">-</dd>
        <dt>Green hosted</dt>
        <dd id="greenHosting">-</dd>
        <dt>Emissions in gCO2</dt>
        <dd id="mgCO2">-</dd>
      </dl>

      <button id="reset-emissions-btn" class="hidden">Reset emissions</button>
      <button id="save-emissions-btn" class="hidden">Save emissions</button>
      <span id="isSaved" class="notification">Saved!</span>
      <span id="isReset" class="notification">Reset!</span>

      <h2 id="requests-by-group" class="hidden">Requests</h2>
      <section id="xhr" class="hidden">
        <details>
          <summary>
            <h3>xhr (fetch)</h3>
          </summary>
          <div>xhr count: 0</div>
          <div>xhr bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="document" class="hidden">
        <details>
          <summary>
            <h3>document</h3>
          </summary>
          <div>document count: 0</div>
          <div>document bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="css" class="hidden">
        <details>
          <summary>
            <h3>css</h3>
          </summary>
          <div>css count: 0</div>
          <div>css bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="script" class="hidden">
        <details>
          <summary>
            <h3>js (script)</h3>
          </summary>
          <div>script count: 0</div>
          <div>script bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="font" class="hidden">
        <details>
          <summary>
            <h3>font</h3>
          </summary>
          <div>font count: 0</div>
          <div>font bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="image" class="hidden">
        <details>
          <summary>
            <h3>image</h3>
          </summary>
          <div>image count: 0</div>
          <div>image bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="video" class="hidden">
        <details>
          <summary>
            <h3>media</h3>
          </summary>
          <div>video count: 0</div>
          <div>video bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="other" class="hidden">
        <details>
          <summary>
            <h3>other</h3>
          </summary>
          <div>other count: 0</div>
          <div>other bytes: 0</div>
          <br />
          <dl></dl>
        </details>
      </section>
      <section id="failed-requests" class="hidden">
        <br />
        <div></div>
        <details>
          <summary>
            <h3>failed requests</h3>
          </summary>
          <ul></ul>
        </details>
      </section>
      <h2 class="hidden">Data</h2>
      <section id="data" class="hidden">
        <p>
          <strong
            >Why does the tracker report fewer requests than Chrome
            DevTools?</strong
          >
        </p>
        <p>
          Chrome DevTools logs resource usage including elements loaded with a
          data: URL which don't trigger an HTTP request. These resources are
          therefore excluded.
        </p>
      </section>
      <button id="export-data-btn" class="hidden">Export data</button>
      <aside>
        <button id="notification">
          Please reload the page to capture website emissions
        </button>
      </aside>
    </main>
    <footer>
      <div>
        CO<sub>2</sub> calculations by
        <a href="https://www.thegreenwebfoundation.org/co2-js/" target="_blank"
          >The Green Web Foundation</a
        >
      </div>
      <div>
        Emissions tracker by
        <a href="https://p-n-c.github.io/website/" target="_blank"
          >People & Code</a
        >
      </div>
    </footer>
  </body>
  <script type="module" src="side-panel.js"></script>
</html>

</document_content>
</document>
<document index="22">
<source>./publish/side_panel\side-panel.js</source>
<document_content>
/* eslint-disable no-undef */

import {
  mapRequestTypeToType,
  format,
  saveTrackerSummary,
  compareCurrentAndPreviousSummaries,
  handleError,
  exportJSON,
  groupRequestsByType,
  toggleNotification,
} from '../background/utils.js'

document.addEventListener('DOMContentLoaded', () => {
  // Capture the Device Pixel Ratio (DPR)
  const dpr = window.devicePixelRatio

  // Send the DPR to the service worker
  chrome.runtime.sendMessage({ type: 'side-panel-dom-loaded', dpr: dpr })

  const resetEmissionsBtn = document.getElementById('reset-emissions-btn')
  const saveEmissionsBtn = document.getElementById('save-emissions-btn')
  const exportSummaryBtn = document.getElementById('export-data-btn')
  const isSavedText = document.getElementById('isSaved')
  const isResetText = document.getElementById('isReset')

  const elements = {
    notification: document.getElementById('notification'),
    sections: {
      document: document.getElementById('document'),
      script: document.getElementById('script'),
      css: document.getElementById('css'),
      image: document.getElementById('image'),
      video: document.getElementById('video'),
      font: document.getElementById('font'),
      xhr: document.getElementById('xhr'),
      other: document.getElementById('other'),
    },
  }

  let summary
  let url = ''
  let requests = new Set()
  let currentKey = ''
  let requestCount = 0
  let failedRequests = new Set()
  let requestsByType = new Set()

  const failedRequestsSection = document.getElementById('failed-requests')

  const populateSummary = (id, value) => {
    if (id === 'data') return

    let displayValue = value

    // convert bytes to kBs and mgs to gs
    if (id === 'bytes' || id === 'mgCO2') {
      if (isNaN(value) || value === 0) displayValue = 0
      displayValue = format({ number: value / 1000 })
    }

    const element = document.getElementById(id)
    if (element) element.textContent = displayValue
  }

  const populateRequestsByType = (type, requests) => {
    const section = elements.sections[type]
    if (!section) return

    // Save locally for export
    requestsByType.add({ type, requests })

    section.classList.remove('hidden')

    const details = section.querySelector('details')
    const counter = section.querySelectorAll('div')[0]
    const bytes = section.querySelectorAll('div')[1]
    const dl = section.querySelector('dl') || document.createElement('dl')

    // Clear previous entries
    resetRequestsByType(type)

    // Add total count and bytes per type
    counter.textContent = `${type} count: ${requests.length}`
    bytes.textContent = `${type} kilobytes: ${format({ number: requests.reduce((acc, curr) => acc + curr.bytes, 0) / 1000 })}`

    requests.forEach((request) => {
      if (currentKey !== request.key) {
        currentKey = request.key
      }

      const dt = document.createElement('dt')
      const dd = document.createElement('dd')
      const dd_div1 = document.createElement('div')
      const dd_div2 = document.createElement('div')

      // Add request url
      dt.textContent = request.url

      // Add bytes per request
      dd_div1.textContent = format({ number: request.bytes })
      dd_div2.textContent = format({ number: request.uncompressedBytes })

      dd.append(dd_div1, dd_div2)
      dl.append(dt, dd)

      details.append(dl)
    })
  }

  const populateFailedRequests = (url, type) => {
    // Convert request type to type
    const resourceType = mapRequestTypeToType(type)
    // Add the failed request url to the set
    failedRequests.add({ url, type: resourceType })

    // Show failed requests
    failedRequestsSection.classList.remove('hidden')

    // Text summary
    failedRequestsSection.querySelector('div').innerText =
      `There were ${failedRequests.size} failed requests.`

    // Get the list
    const ul = failedRequestsSection.querySelector('ul')

    // Clear the list
    ul.innerHTML = ''

    // We populate the list afresh each time to avoid duplicates
    failedRequests.forEach((fr) => {
      const li = document.createElement('li')
      li.innerText = `${fr.type}: ${fr.url}`
      ul.appendChild(li)
    })
  }

  const resetRequestsByType = (type) => {
    const dl = document.querySelector(`#${type} dl`)
    if (dl) {
      dl.innerHTML = ''
      const aggregates = document.querySelectorAll(`#${type} div`)
      aggregates[0].textContent = `${type} count: 0`
      aggregates[1].textContent = `${type} kilobytes: 0`
    } else {
      handleError(
        `${type} does not have a corresponding element`,
        'reset request by type'
      )
    }
  }

  const resetPanelDisplay = () => {
    // Reset summary values
    ;['url', 'bytes', 'request-count', 'greenHosting', 'mgCO2'].forEach((id) =>
      populateSummary(id, '-')
    )

    // Reset request by type sections
    Object.keys(elements.sections).forEach((type) => {
      resetRequestsByType(type)
    })
    requestCount = 0
    currentKey = ''
    requests.clear()
    failedRequests.clear()
    requestsByType.clear()

    // Reset failed requests
    failedRequestsSection.classList.add('hidden')
    failedRequestsSection.querySelector('div').innerText = ''
    failedRequestsSection.querySelector('ul').innerHTML = ''

    // Remove arrows that show rise or fall in comparison to previous summary
    document.querySelectorAll('.up').forEach((up) => up.classList.remove('up'))
    document
      .querySelectorAll('.down')
      .forEach((down) => down.classList.remove('down'))
  }

  // We need to reset the display in these 3 scenarios
  // The service worker db is cleared before any of these messages is received by the side panel
  chrome.runtime.onMessage.addListener((message) => {
    // If the visitors goes elsewhere, close the side panel
    if (message.action === 'close-side-panel') {
      window.close()
    }

    if (message.action === 'url-changed' || message.action === 'url-reloaded') {
      resetPanelDisplay()
      if (message.url !== url) {
        url = message.url
      }
    }

    if (message.action === 'network-traffic') {
      // Update summary and requests
      if (message.data.status === 200) {
        Object.entries(message.data).forEach(([key, value]) =>
          populateSummary(key, value)
        )

        // Show request details categories
        document
          .querySelectorAll('.hidden:not(#failed-requests)')
          .forEach((hidden) => hidden?.classList.remove('hidden'))

        // Add counts from each type to the total
        requestCount = message.data.data.groupedByTypeBytes.reduce(
          (prevType, currType) => {
            return prevType + currType.count
          },
          0
        )

        // Update total request count
        document.getElementById('request-count').innerText = requestCount
        try {
          Object.entries(message.data.data.groupedByType).forEach(
            ([type, value]) => {
              populateRequestsByType(type, value)
            }
          )
        } catch (e) {
          handleError(e, 'processing network traffic')
        }

        // Hide visitor notification to reload the page
        elements.notification.style.display = 'none'
      } else {
        // Update failed requests
        populateFailedRequests(message.data.url, message.data.type)
      }

      if (message.data.bytes === 0) return

      summary = {
        url,
        bytes: message.data.bytes,
        mgCO2: message.data.mgCO2,
        requestCount,
      }
      compareCurrentAndPreviousSummaries(url, summary)
    }
  })

  // Reset emissions - clear the indexDB database
  resetEmissionsBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'reset-emissions' })
    resetPanelDisplay()
    toggleNotification(isResetText)
  })

  // Save emissions - to the panel Local storage
  saveEmissionsBtn.addEventListener('click', () => {
    if (summary) {
      const isSaved = saveTrackerSummary(summary)
      if (isSaved) {
        toggleNotification(isSavedText)
      }
    }
  })

  // Export data - to a local file
  exportSummaryBtn.addEventListener('click', () => {
    const json = {
      summary,
      data: groupRequestsByType(requestsByType),
    }
    exportJSON(json)
  })
})

</document_content>
</document>
</documents>
