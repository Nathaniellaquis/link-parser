import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const linkedin: PlatformModule = {
  id: Platforms.LinkedIn,
  name: 'LinkedIn',
  color: '#0A66C2',

  domains: ['linkedin.com'],

  patterns: {
    profile: /linkedin\.com\/in\/([A-Za-z0-9-_%]+)/i,
    handle: /^[A-Za-z0-9-]{3,100}$/,
    content: {
      post: /linkedin\.com\/feed\/update\/urn:li:activity:(\d+)/i,
    },
  },

  detect(url: string): boolean {
    return url.includes('linkedin.com')
  },

  extract(url: string, result: ParsedUrl): void {
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.postId = postMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
    }

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
    return `https://linkedin.com/in/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]trk=[^&]+/g, ''))
  },
}