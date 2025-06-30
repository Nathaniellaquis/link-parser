import { registry } from '../platforms'
import { ParsedUrl } from './types'

/**
 * Parse a social media URL or handle into structured data.
 */
export function parse(url: string): ParsedUrl {
  // Add protocol if missing
  let processedUrl = url.trim()
  if (!processedUrl.match(/^https?:\/\//i) && !processedUrl.startsWith('mailto:') && !processedUrl.startsWith('tel:')) {
    // Check if it's an email pattern (has @ before the domain)
    const isEmail = /^[^@]+@[^@]+\.[^@]+$/.test(processedUrl)

    // If it looks like a domain (contains a dot) and is not an email
    if (processedUrl.includes('.') && !isEmail) {
      processedUrl = `https://${processedUrl}`
    }
  }

  const result: ParsedUrl = {
    isValid: false,
    originalUrl: url,
    normalizedUrl: processedUrl,
    platform: null,
    ids: {},
    metadata: {}
  }

  // Try each platform
  for (const [_, module] of registry) {
    if (module.detect(processedUrl)) {
      result.platform = module.id
      result.platformName = module.name
      module.extract(processedUrl, result)
      result.normalizedUrl = module.normalizeUrl(processedUrl)
      // Consider valid only if extractor filled at least one identifier or username
      if (result.username || Object.keys(result.ids).length > 0 || (result.metadata && Object.keys(result.metadata).length > 0)) {
        result.isValid = true
      }

      // Extract embed data if the platform supports it
      if (module.getEmbedInfo) {
        const embedInfo = module.getEmbedInfo(processedUrl, result)
        if (embedInfo) {
          result.embedData = {
            platform: module.id,
            type: embedInfo.type || 'iframe',
            contentId: result.ids.videoId || result.ids.postId || result.ids.trackId || '',
            embedUrl: embedInfo.embedUrl,
            options: embedInfo.options
          }

          // Mark if the URL is already an embed
          if (embedInfo.isEmbedAlready) {
            result.metadata.isEmbed = true
          }
        }
      }

      break
    }
  }

  return result
}