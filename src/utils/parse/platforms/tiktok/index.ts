import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const tiktok: PlatformModule = {
  id: Platforms.TikTok,
  name: 'TikTok',
  color: '#000000',

  domains: ['tiktok.com'],
  mobileSubdomains: ['m', 'vm'],
  shortDomains: ['vm.tiktok.com'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9._]{2,24})$/i,
    handle: /^@?[A-Za-z0-9._]{2,24}$/,
    content: {
      video: /^https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9._]{2,24})\/video\/(\d{10,20})$/i,
      live: /^https?:\/\/(?:www\.)?tiktok\.com\/@([A-Za-z0-9._]{2,24})\/live$/i,
      short: /^https?:\/\/vm\.tiktok\.com\/([A-Za-z0-9]+)$/i,
      embed: /^https?:\/\/(?:www\.)?tiktok\.com\/embed\/v2\/(\d{10,20})$/i,
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d)) && !this.shortDomains?.some(sd => url.includes(sd))) {
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