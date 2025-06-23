import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const facebook: PlatformModule = {
  id: Platforms.Facebook,
  name: 'Facebook',
  color: '#1877F2',

  domains: ['facebook.com', 'fb.com'],
  mobileSubdomains: ['m', 'mobile'],

  patterns: {
    profile: /(?:facebook\.com|fb\.com)\/profile\.php\?id=(\d+)|(?:facebook\.com|fb\.com)\/([A-Za-z0-9_.]+)/i,
    handle: /^[A-Za-z0-9.]{5,}$/,
    content: {
      post: /(?:facebook\.com|fb\.com)\/[A-Za-z0-9_.]+\/posts\/(\d+)/i,
      video: /(?:facebook\.com|fb\.com)\/[A-Za-z0-9_.]+\/videos\/(\d+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d))
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
          break
        }
      }
    }

    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[2] || undefined
      result.userId = profileMatch[1] || undefined
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://facebook.com/${username}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://facebook.com/watch/?v=${id}`
    }
    return `https://facebook.com/story.php?story_fbid=${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](mibextid|ref|refsrc|_rdc|_rdr|sfnsn|hc_ref)=[^&]+/g, '')
    return normalize(url)
  },
}