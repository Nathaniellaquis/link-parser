import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['pinterest.com', 'pin.it']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains)

export const pinterest: PlatformModule = {
  id: Platforms.Pinterest,
  name: 'Pinterest',
  color: '#BD081C',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,15})${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{3,15}$/,
    content: {
      pin: new RegExp(`^https?://${DOMAIN_PATTERN}/pin/(\\d+)/?${QUERY_HASH}$`, 'i'),
      board: new RegExp(`^https?://${DOMAIN_PATTERN}/(?!pin/)([A-Za-z0-9_]{3,15})/([A-Za-z0-9_-]{2,})/?${QUERY_HASH}$`, 'i'),
      short: new RegExp(`^https?://(?:www\\.)?pin\\.it/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false

    // Check specific content patterns first
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    // Check profile pattern last (most general)
    if (this.patterns.profile.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle pin URLs first (most specific)
    const pinMatch = this.patterns.content?.pin?.exec(url)
    if (pinMatch) {
      result.ids.pinId = pinMatch[1]
      result.metadata.isPin = true
      result.metadata.contentType = 'pin'
      return
    }

    // Handle board URLs (more specific than profile)
    const boardMatch = this.patterns.content?.board?.exec(url)
    if (boardMatch && boardMatch[2]) {
      result.ids.boardName = boardMatch[2]
      result.username = boardMatch[1]
      result.metadata.isBoard = true
      result.metadata.contentType = 'board'
      return
    }

    // Handle profile URLs (general pattern)
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      // Additional validation: profile URLs should not have trailing paths
      const cleanUrl = url.split('?')[0].split('#')[0];
      if (cleanUrl.endsWith('/')) {
        return; // Not a valid profile URL
      }

      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
      return
    }

    // Handle short URLs (pin.it only)
    const shortMatch = this.patterns.content?.short?.exec(url)
    if (shortMatch) {
      result.ids.shortId = shortMatch[1]
      result.metadata.isShort = true
      result.metadata.contentType = 'short'
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