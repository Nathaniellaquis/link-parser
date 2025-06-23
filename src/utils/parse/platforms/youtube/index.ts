import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const youtube: PlatformModule = {
  id: Platforms.YouTube,
  name: 'YouTube',
  color: '#FF0000',

  domains: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
  mobileSubdomains: ['m', 'mobile'],
  shortDomains: ['youtu.be'],

  patterns: {
    profile: /youtube\.com\/(?:c\/|channel\/|user\/|@)([a-zA-Z0-9_-]+)/i,
    handle: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
    content: {
      video: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
      short: /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
      playlist: /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i,
      live: /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(domain => url.includes(domain))
  },

  extract(url: string, result: ParsedUrl): void {
    if (this.patterns.content) {
      for (const [type, patternValue] of Object.entries(this.patterns.content)) {
        const pattern = patternValue as RegExp | undefined
        if (!pattern) continue
        const match = pattern.exec(url)
        if (match) {
          result.ids[`${type}Id`] = match[1]
          result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
          result.metadata.contentType = type
          if (['video', 'short', 'live'].includes(type)) {
            const tMatch = url.match(/[?&]t=(\d+)/)
            if (tMatch) result.metadata.timestamp = parseInt(tMatch[1])
          }
          break
        }
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
    return this.patterns.handle.test(handle.replace('@', ''))
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '')
    if (clean.startsWith('UC') && clean.length === 24) {
      return `https://youtube.com/channel/${clean}`
    }
    return `https://youtube.com/@${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (['video', 'short', 'live'].includes(contentType)) return `https://youtube.com/watch?v=${id}`
    if (contentType === 'playlist') return `https://youtube.com/playlist?list=${id}`
    return `https://youtube.com/watch?v=${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](feature|si|pp|ab_channel)=[^&]+/g, '')
    return normalize(url)
  },

  extractTimestamp(url: string): number | null {
    const match = url.match(/[?&]t=(\d+)/)
    return match ? parseInt(match[1]) : null
  },

  generateEmbedUrl(contentId: string, options?: { startTime?: number; autoplay?: boolean }): string {
    const params = new URLSearchParams()
    if (options?.startTime) params.set('start', options.startTime.toString())
    if (options?.autoplay) params.set('autoplay', '1')
    const qs = params.toString()
    return `https://www.youtube.com/embed/${contentId}${qs ? `?${qs}` : ''}`
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    const match = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(shortUrl)
    if (match) return `https://youtube.com/watch?v=${match[1]}`
    return shortUrl
  },
}