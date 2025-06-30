import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['twitch.tv']
const subdomains = ['clips']  // clips.twitch.tv

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const twitch: PlatformModule = {
  id: Platforms.Twitch,
  name: 'Twitch',
  color: '#9146FF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{4,25})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{4,25}$/,
    content: {
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/videos/(\\d+)/?${QUERY_HASH}$`, 'i'),
      clip: new RegExp(`^https?://(?:www\\.)?clips\\.twitch\\.tv/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
      collection: new RegExp(`^https?://${DOMAIN_PATTERN}/collections/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle clip URLs (most specific - clips.twitch.tv only)
    const clipMatch = this.patterns.content?.clip?.exec(url)
    if (clipMatch) {
      result.ids.clipName = clipMatch[1]
      result.metadata.isClip = true
      result.metadata.contentType = 'clip'
      return
    }

    // Handle video URLs (specific path)
    const videoMatch = this.patterns.content?.video?.exec(url)
    if (videoMatch) {
      result.ids.videoId = videoMatch[1]
      result.metadata.isVideo = true
      result.metadata.contentType = 'video'
      return
    }

    // Handle collection URLs (specific path)
    const collectionMatch = this.patterns.content?.collection?.exec(url)
    if (collectionMatch) {
      result.ids.collectionId = collectionMatch[1]
      result.metadata.isCollection = true
      result.metadata.contentType = 'collection'
      return
    }

    // Handle profile URLs (general pattern)
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
    return `https://twitch.tv/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}