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

export const format = ({
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