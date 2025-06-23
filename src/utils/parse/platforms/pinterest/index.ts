import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const pinterest: PlatformModule = {
  id: Platforms.Pinterest,
  name: 'Pinterest',
  color: '#BD081C',

  domains: ['pinterest.com', 'pin.it'],

  patterns: {
    profile: /pinterest\.com\/([A-Za-z0-9_]+)/i,
    handle: /^[A-Za-z0-9_]{3,15}$/,
    content: {
      pin: /pinterest\.com\/pin\/(\d+)/i,
      short: /pin\.it\/([A-Za-z0-9]+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d))
  },

  extract(url: string, result: ParsedUrl): void {
    for (const [type, patternValue] of Object.entries(this.patterns.content || {})) {
      const pattern = patternValue as RegExp | undefined
      if (!pattern) continue
      const match = pattern.exec(url)
      if (match) {
        result.ids[`${type}Id`] = match[1]
        result.metadata.contentType = type
        result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
        break
      }
    }

    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://pinterest.com/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''))
  },
}