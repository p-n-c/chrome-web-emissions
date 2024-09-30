const compressionMatrix = {
  document: {
    br: [
      { sizeThreshold: 50000, compressionRatio: 0.6 },
      { sizeThreshold: 100000, compressionRatio: 0.4 },
      { sizeThreshold: Infinity, compressionRatio: 0.2 },
    ],
    gzip: [
      { sizeThreshold: 50000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
    deflate: [
      { sizeThreshold: 50000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    zstd: [
      { sizeThreshold: 50000, compressionRatio: 0.55 },
      { sizeThreshold: 100000, compressionRatio: 0.35 },
      { sizeThreshold: Infinity, compressionRatio: 0.15 },
    ],
  },
  script: {
    br: [
      { sizeThreshold: 20000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    gzip: [
      { sizeThreshold: 20000, compressionRatio: 0.75 },
      { sizeThreshold: 100000, compressionRatio: 0.55 },
      { sizeThreshold: Infinity, compressionRatio: 0.35 },
    ],
    deflate: [
      { sizeThreshold: 20000, compressionRatio: 0.8 },
      { sizeThreshold: 100000, compressionRatio: 0.6 },
      { sizeThreshold: Infinity, compressionRatio: 0.4 },
    ],
    zstd: [
      { sizeThreshold: 20000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
  },
  css: {
    br: [
      { sizeThreshold: 20000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    gzip: [
      { sizeThreshold: 20000, compressionRatio: 0.75 },
      { sizeThreshold: 100000, compressionRatio: 0.55 },
      { sizeThreshold: Infinity, compressionRatio: 0.35 },
    ],
    deflate: [
      { sizeThreshold: 20000, compressionRatio: 0.8 },
      { sizeThreshold: 100000, compressionRatio: 0.6 },
      { sizeThreshold: Infinity, compressionRatio: 0.4 },
    ],
    zstd: [
      { sizeThreshold: 20000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
  },
  image: {
    br: [
      { sizeThreshold: 20000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    gzip: [
      { sizeThreshold: 20000, compressionRatio: 0.75 },
      { sizeThreshold: 100000, compressionRatio: 0.55 },
      { sizeThreshold: Infinity, compressionRatio: 0.35 },
    ],
    deflate: [
      { sizeThreshold: 20000, compressionRatio: 0.8 },
      { sizeThreshold: 100000, compressionRatio: 0.6 },
      { sizeThreshold: Infinity, compressionRatio: 0.4 },
    ],
    zstd: [
      { sizeThreshold: 20000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
  },
  font: {
    br: [
      { sizeThreshold: 20000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    gzip: [
      { sizeThreshold: 20000, compressionRatio: 0.75 },
      { sizeThreshold: 100000, compressionRatio: 0.55 },
      { sizeThreshold: Infinity, compressionRatio: 0.35 },
    ],
    deflate: [
      { sizeThreshold: 20000, compressionRatio: 0.8 },
      { sizeThreshold: 100000, compressionRatio: 0.6 },
      { sizeThreshold: Infinity, compressionRatio: 0.4 },
    ],
    zstd: [
      { sizeThreshold: 20000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
  },
  other: {
    br: [
      { sizeThreshold: 20000, compressionRatio: 0.7 },
      { sizeThreshold: 100000, compressionRatio: 0.5 },
      { sizeThreshold: Infinity, compressionRatio: 0.3 },
    ],
    gzip: [
      { sizeThreshold: 20000, compressionRatio: 0.75 },
      { sizeThreshold: 100000, compressionRatio: 0.55 },
      { sizeThreshold: Infinity, compressionRatio: 0.35 },
    ],
    deflate: [
      { sizeThreshold: 20000, compressionRatio: 0.8 },
      { sizeThreshold: 100000, compressionRatio: 0.6 },
      { sizeThreshold: Infinity, compressionRatio: 0.4 },
    ],
    zstd: [
      { sizeThreshold: 20000, compressionRatio: 0.65 },
      { sizeThreshold: 100000, compressionRatio: 0.45 },
      { sizeThreshold: Infinity, compressionRatio: 0.25 },
    ],
  },
}

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

export const getCompressedSize = (
  compressedBytes,
  uncompressedBytes,
  requestType,
  encoding
) => {
  if (
    !compressionMatrix[requestType] ||
    !compressionMatrix[requestType][encoding] ||
    compressedBytes !== 0
  ) {
    return {
      bytes: compressedBytes,
      compressionRatio: 'n/a',
    }
  }

  const matrix = compressionMatrix[requestType][encoding]
  const selectedLevel = matrix.find(
    ({ sizeThreshold }) => uncompressedBytes <= sizeThreshold
  )

  if (!selectedLevel) return uncompressedBytes // No matching threshold found, return original size

  const compressionRatio = selectedLevel.compressionRatio

  return {
    bytes: Math.round(uncompressedBytes * compressionRatio),
    compressionRatio,
  }
}
