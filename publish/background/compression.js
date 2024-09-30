const compressionRates = {
  br: [
    { level: 0, rate: 1.2 },
    { level: 1, rate: 2.1 },
    { level: 2, rate: 2.5 },
    { level: 3, rate: 3.0 },
    { level: 4, rate: 3.5 },
    { level: 5, rate: 4.0 },
    { level: 6, rate: 4.3 },
    { level: 7, rate: 4.6 },
    { level: 8, rate: 4.9 },
    { level: 9, rate: 5.0 },
    { level: 10, rate: 5.1 },
    { level: 11, rate: 5.2 },
  ],
  gzip: [
    { level: 0, rate: 1 },
    { level: 1, rate: 1.5 },
    { level: 2, rate: 2.0 },
    { level: 3, rate: 2.3 },
    { level: 4, rate: 2.5 },
    { level: 5, rate: 2.8 },
    { level: 6, rate: 3.0 },
    { level: 7, rate: 3.2 },
    { level: 8, rate: 3.3 },
    { level: 9, rate: 3.4 },
  ],
  deflate: [
    { level: 0, rate: 1 },
    { level: 1, rate: 1.6 },
    { level: 2, rate: 2.2 },
    { level: 3, rate: 2.8 },
    { level: 4, rate: 3.1 },
    { level: 5, rate: 3.3 },
    { level: 6, rate: 3.5 },
    { level: 7, rate: 3.6 },
    { level: 8, rate: 3.7 },
    { level: 9, rate: 3.8 },
  ],
  zstd: [
    { level: 0, rate: 1.1 },
    { level: 1, rate: 1.9 },
    { level: 2, rate: 2.3 },
    { level: 3, rate: 2.7 },
    { level: 4, rate: 3.0 },
    { level: 5, rate: 3.2 },
    { level: 6, rate: 3.4 },
    { level: 7, rate: 3.6 },
    { level: 8, rate: 3.8 },
    { level: 9, rate: 4.0 },
  ],
}

const compressionMatrix = {
  document: [
    {
      sizeThreshold: 50000,
      compressionRatio: 0.6,
      brotliLevel: 5,
      gzipLevel: 6,
      deflateLevel: 5,
      zstdLevel: 5,
    },
    {
      sizeThreshold: 100000,
      compressionRatio: 0.4,
      brotliLevel: 6,
      gzipLevel: 7,
      deflateLevel: 6,
      zstdLevel: 8,
    },
    {
      sizeThreshold: Infinity,
      compressionRatio: 0.2,
      brotliLevel: 8,
      gzipLevel: 9,
      deflateLevel: 9,
      zstdLevel: 12,
    },
  ],
  script: [
    {
      sizeThreshold: 20000,
      compressionRatio: 0.7,
      brotliLevel: 5,
      gzipLevel: 5,
      deflateLevel: 4,
      zstdLevel: 4,
    },
    {
      sizeThreshold: 100000,
      compressionRatio: 0.5,
      brotliLevel: 6,
      gzipLevel: 6,
      deflateLevel: 5,
      zstdLevel: 7,
    },
    {
      sizeThreshold: Infinity,
      compressionRatio: 0.3,
      brotliLevel: 8,
      gzipLevel: 9,
      deflateLevel: 7,
      zstdLevel: 9,
    },
  ],
  css: [
    {
      sizeThreshold: 10000,
      compressionRatio: 0.7,
      brotliLevel: 4,
      gzipLevel: 4,
      deflateLevel: 3,
      zstdLevel: 3,
    },
    {
      sizeThreshold: 100000,
      compressionRatio: 0.5,
      brotliLevel: 5,
      gzipLevel: 6,
      deflateLevel: 5,
      zstdLevel: 6,
    },
    {
      sizeThreshold: Infinity,
      compressionRatio: 0.3,
      brotliLevel: 8,
      gzipLevel: 8,
      deflateLevel: 8,
      zstdLevel: 9,
    },
  ],
  image: [
    {
      sizeThreshold: Infinity,
      compressionRatio: 0.95,
      brotliLevel: 1,
      gzipLevel: 1,
      deflateLevel: 1,
      zstdLevel: 1,
    },
  ],
  other: [
    {
      sizeThreshold: 50000,
      compressionRatio: 0.6,
      brotliLevel: 5,
      gzipLevel: 6,
      deflateLevel: 5,
      zstdLevel: 5,
    },
    {
      sizeThreshold: 100000,
      compressionRatio: 0.4,
      brotliLevel: 6,
      gzipLevel: 7,
      deflateLevel: 6,
      zstdLevel: 8,
    },
    {
      sizeThreshold: Infinity,
      compressionRatio: 0.2,
      brotliLevel: 8,
      gzipLevel: 9,
      deflateLevel: 9,
      zstdLevel: 12,
    },
  ],
}

export const getCompressedSize = (bytes, requestType, encoding) => {
  if (requestType === 'video' || requestType === 'font') return bytes

  const matrix = compressionMatrix[requestType]
  if (!matrix) throw new Error('Unsupported content type')

  let level, compressionRatio
  for (const {
    sizeThreshold,
    compressionRatio: ratio,
    brotliLevel,
    gzipLevel,
    deflateLevel,
    zstdLevel,
  } of matrix) {
    if (bytes <= sizeThreshold) {
      compressionRatio = ratio
      switch (encoding) {
        case 'br':
          level = brotliLevel
          break
        case 'gzip':
          level = gzipLevel
          break
        case 'deflate':
          level = deflateLevel
          break
        case 'zstd':
          level = zstdLevel
          break
        default:
          throw new Error(`Unsupported encoding ${encoding}`)
      }
      break
    }
  }

  const rate = compressionRates[encoding]?.find((r) => r.level === level)?.rate
  return rate ? Math.round(bytes / rate) : bytes
}
