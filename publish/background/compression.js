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

const compressionMatrix = {
  xhr: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 11).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 11).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  document: {
    br: [
      {
        sizeThreshold: 50000,
        compressionRatio: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 10).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 11).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 50000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 50000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 50000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  css: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  script: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 1).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 4).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 4).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 7).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 8).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  font: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  image: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  media: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
      },
    ],
  },
  other: {
    br: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.br.find((r) => r.level === 2).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.br.find((r) => r.level === 8).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.br.find((r) => r.level === 9).rate,
      },
    ],
    gzip: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.gzip.find((r) => r.level === 9).rate,
      },
    ],
    deflate: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 0)
          .rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 5)
          .rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.deflate.find((r) => r.level === 9)
          .rate,
      },
    ],
    zstd: [
      {
        sizeThreshold: 20000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 0).rate,
      },
      {
        sizeThreshold: 100000,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 5).rate,
      },
      {
        sizeThreshold: Infinity,
        compressionRatio: compressionRates.zstd.find((r) => r.level === 9).rate,
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
