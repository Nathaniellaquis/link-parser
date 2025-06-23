import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const tiktok: PlatformModule = {
  id: Platforms.TikTok,
  name: 'TikTok',
  color: '#000000',

  domains: ['tiktok.com'],
  mobileSubdomains: ['m', 'vm'],
  shortDomains: ['vm.tiktok.com'],

  patterns: {
    profile: /tiktok\.com\/@([A-Za-z0-9._]+)/i,
    handle: /^@[A-Za-z0-9._]{2,24}$/,
    content: {
      video: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i,
      short: /vm\.tiktok\.com\/([A-Za-z0-9]+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d)) || this.shortDomains?.some(sd => url.includes(sd)) || false
  },

  extract(url: string, result: ParsedUrl): void {
    // Video detection
    if (this.patterns.content) {
      for (const [type, patternValue] of Object.entries(this.patterns.content)) {
        const pattern = patternValue as RegExp | undefined
        if (!pattern) continue
        const match = pattern.exec(url)
        if (match) {
          result.ids[`${type}Id`] = match[1]
          result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
          result.metadata.contentType = 'video'
          break
        }
      }
    }

    // Profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle.startsWith('@') ? handle : `@${handle}`)
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
    // In real world we'd hit network; here stub to return same
    return shortUrl
  },
}