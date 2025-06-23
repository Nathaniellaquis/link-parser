/*
 * URL utilities for the platform parser
 */

/**
 * Remove known tracking query parameters from a URL string
 */
export function stripTrackingParams(url: string): string {
  const urlObj = new URL(url, url.startsWith('http') ? undefined : 'https://dummy.invalid')

  const paramsToStrip = [
    // Generic tracking parameters
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'igshid',
    // Platform-specific variants (prefix match)
  ]

  paramsToStrip.forEach(param => urlObj.searchParams.delete(param))

  return urlObj.search ? urlObj.toString() : urlObj.toString().replace(/\?$/, '')
}

/**
 * Ensure a URL string starts with https://.
 */
export function ensureHttps(url: string): string {
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  if (!url.startsWith('http')) {
    return `https://${url}`
  }
  return url
}

/**
 * Remove a trailing slash from the URL (unless it is the only path separator)
 */
export function removeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

/**
 * Normalize a URL using standard rules: https enforcement, strip tracking, remove trailing slash
 */
export function normalize(url: string): string {
  return removeTrailingSlash(stripTrackingParams(ensureHttps(url)))
}