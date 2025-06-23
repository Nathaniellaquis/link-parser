import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const instagram: PlatformModule = {
  id: Platforms.Instagram,
  name: 'Instagram',
  color: '#E1306C',

  domains: ['instagram.com', 'instagr.am'],
  mobileSubdomains: ['m', 'mobile'],

  patterns: {
    profile: /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.)?(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9_.]+)/i,
    handle: /^[\w](?!.*?\.{2})[\w.]{0,28}[\w]$/i,
    content: {
      post: /instagram\.com\/p\/([A-Za-z0-9_-]+)/i,
      reel: /instagram\.com\/reel[s]?\/([A-Za-z0-9_-]+)/i,
      story: /instagram\.com\/stories\/([a-zA-Z0-9_.]+)\/(\d+)/i,
      tv: /instagram\.com\/tv\/([A-Za-z0-9_-]+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(domain => url.includes(domain))
  },

  extract(url: string, result: ParsedUrl): void {
    // Profile match (but avoid content paths)
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch && !/\/(p|reel|tv|stories)\//.test(url)) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }

    // Content detection
    if (this.patterns.content) {
      for (const [type, patternValue] of Object.entries(this.patterns.content)) {
        const pattern = patternValue as RegExp | undefined
        if (!pattern) continue
        const match = pattern.exec(url)
        if (match) {
          result.ids[`${type}Id`] = match[1]
          result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
          result.metadata.contentType = type
          break
        }
      }
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle.replace('@', ''))
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '')
    return `https://instagram.com/${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    const map: Record<string, string> = { post: 'p', reel: 'reel', tv: 'tv' }
    const path = map[contentType] || 'p'
    return `https://instagram.com/${path}/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](igshid|utm_[^&]+|ig_[^&]+)=[^&]+/g, ''))
  },
}