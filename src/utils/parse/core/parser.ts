import { registry } from '../platforms'
import { ParsedUrl } from './types'

/**
 * Parse a social media URL or handle into structured data.
 */
export function parse(url: string): ParsedUrl {
  const result: ParsedUrl = {
    isValid: false,
    originalUrl: url,
    normalizedUrl: url,
    platform: null,
    ids: {},
    metadata: {}
  }

  // Try each platform
  for (const [_, module] of registry) {
    if (module.detect(url)) {
      result.platform = module.id
      result.platformName = module.name
      module.extract(url, result)
      result.normalizedUrl = module.normalizeUrl(url)
      result.isValid = true
      break
    }
  }

  return result
}