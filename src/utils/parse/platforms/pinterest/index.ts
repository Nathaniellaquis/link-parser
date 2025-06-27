import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

export const pinterest: PlatformModule = {
  id: Platforms.Pinterest,
  name: 'Pinterest',
  color: '#BD081C',

  domains: ['pinterest.com', 'pin.it'],

  patterns: {
    profile: new RegExp(`^https?:\\/\\/(?:www\\.)?pinterest\\.com\\/([A-Za-z0-9_]{3,15})\\/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{3,15}$/,
    content: {
      pin: new RegExp(`^https?:\\/\\/(?:www\\.)?pinterest\\.com\\/pin\\/(\\d+)\\/?${QUERY_HASH}$`, 'i'),
      board: new RegExp(`^https?:\\/\\/(?:www\\.)?pinterest\\.com\\/([A-Za-z0-9_]+)\\/([A-Za-z0-9_-]+)\\/?${QUERY_HASH}$`, 'i'),
      short: new RegExp(`^https?:\\/\\/pin\.it\\/([A-Za-z0-9]+)\\/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    if (this.patterns.profile.test(url)) return true
    for (const p of Object.values(this.patterns.content || {})) {
      if (p && p.test(url)) return true
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
    if (boardMatch && boardMatch[2]) {
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