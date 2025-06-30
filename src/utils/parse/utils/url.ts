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

export function cleanURL(url: string): string {
  return url.trim().toLowerCase();
}

/**
 * Creates a regex pattern string that matches any of the provided domains
 * with optional subdomains (www, mobile, open, etc.) and proper escaping
 * 
 * @param domains - Array of domain strings (e.g., ['youtube.com', 'youtu.be'])
 * @param subdomains - Optional array of allowed subdomains (e.g., ['m', 'mobile', 'open']). Always includes 'www' by default.
 * @returns Regex pattern string (e.g., '(?:(?:www\\.|m\\.|mobile\\.)?(?:youtube\\.com|youtu\\.be))')
 */
export function createDomainPattern(
  domains: string[],
  subdomains: string[] = []
): string {
  if (!domains || domains.length === 0) {
    throw new Error('At least one domain must be provided');
  }

  // Escape special regex characters in domains and join with |
  const escapedDomains = domains
    .map(domain => domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  // Build subdomain pattern - always include www
  const allSubdomains = ['www', ...subdomains];
  const escapedSubdomains = allSubdomains
    .map(sub => sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  // Return pattern with optional subdomain prefix
  return `(?:(?:(?:${escapedSubdomains})\\.)?(?:${escapedDomains}))`;
}