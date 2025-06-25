import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const pinterest: PlatformModule = {
  id: Platforms.Pinterest,
  name: 'Pinterest',
  color: '#BD081C',

  domains: ['pinterest.com', 'pin.it'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?pinterest\.com\/([A-Za-z0-9_]{3,15})$/i,
    handle: /^[A-Za-z0-9_]{3,15}$/,
    content: {
      pin: /^https?:\/\/(?:www\.)?pinterest\.com\/pin\/(\d+)$/i,
      board: /^https?:\/\/(?:www\.)?pinterest\.com\/([A-Za-z0-9_]+)\/([A-Za-z0-9_-]+)$/i,
      short: /^https?:\/\/pin\.it\/([A-Za-z0-9]+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content) {
      // Special check for pin URLs - must be numeric
      if (url.includes('/pin/')) {
        return /\/pin\/\d+$/i.test(url)
      }

      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle pin URLs (must check before board)
    const pinMatch = this.patterns.content?.pin?.exec(url)
    if (pinMatch) {
      result.ids.pinId = pinMatch[1]
      result.metadata.isPin = true
      result.metadata.contentType = 'pin'
      return
    }

    // Handle short URLs
    const shortMatch = this.patterns.content?.short?.exec(url)
    if (shortMatch) {
      result.ids.shortId = shortMatch[1]
      result.metadata.isShort = true
      result.metadata.contentType = 'short'
      return
    }

    // Handle board URLs (exclude pin URLs)
    const boardMatch = this.patterns.content?.board?.exec(url)
    if (boardMatch && !url.includes('/pin/')) {
      result.ids.boardName = boardMatch[2]
      result.username = boardMatch[1]
      result.metadata.isBoard = true
      result.metadata.contentType = 'board'
      return
    }

    // Handle profile URLs
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