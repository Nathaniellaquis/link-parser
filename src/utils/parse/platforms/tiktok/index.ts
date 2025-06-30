import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['tiktok.com']
const subdomains = ['m', 'vm']  // vm.tiktok.com is just a subdomain, not separate domain

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const tiktok: PlatformModule = {
  id: Platforms.TikTok,
  name: 'TikTok',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9._]{2,24}$/,
    content: {
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/video/(\\d{10,20})/?${QUERY_HASH}$`, 'i'),
      live: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/live/?${QUERY_HASH}$`, 'i'),
      short: new RegExp(`^https?://vm\\.tiktok\\.com/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
      embed: new RegExp(`^https?://${DOMAIN_PATTERN}/embed/v2/(\\d{10,20})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) {
      return false
    }

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
    // Handle embed URLs
    const embedMatch = this.patterns.content?.embed?.exec(url)
    if (embedMatch) {
      result.ids.videoId = embedMatch[1]
      result.metadata.isEmbed = true
      result.metadata.contentType = 'embed'
      return
    }

    // Handle video URLs
    const videoMatch = this.patterns.content?.video?.exec(url)
    if (videoMatch) {
      result.username = videoMatch[1]
      result.ids.videoId = videoMatch[2]
      result.metadata.isVideo = true
      result.metadata.contentType = 'video'
      return
    }

    // Handle live URLs
    const liveMatch = this.patterns.content?.live?.exec(url)
    if (liveMatch) {
      result.username = liveMatch[1]
      result.metadata.isLive = true
      result.metadata.contentType = 'live'
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

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    const cleaned = handle.replace('@', '')
    return /^[A-Za-z0-9._]{2,24}$/.test(cleaned)
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '')
    return `https://tiktok.com/@${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://tiktok.com/@placeholder/video/${id}`
    }
    return `https://tiktok.com/v/${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](lang|_d|utm_[^&]+)=[^&]+/g, '')
    return normalize(url)
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    return shortUrl
  },

  getEmbedInfo(url: string, parsed) {
    if (/tiktok\.com\/embed\//.test(url)) {
      return { embedUrl: url, isEmbedAlready: true }
    }
    const id = parsed.ids.videoId
    if (id) {
      const embedUrl = `https://www.tiktok.com/embed/v2/${id}`
      return { embedUrl, type: 'iframe' }
    }
    return null
  },
}