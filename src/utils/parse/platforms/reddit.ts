import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const reddit: PlatformModule = {
  id: Platforms.Reddit,
  name: 'Reddit',
  color: '#FF4500',

  domains: ['reddit.com', 'redd.it'],

  patterns: {
    profile: /(?:reddit\.com)\/user\/([A-Za-z0-9_-]+)/i,
    handle: /^u\/[A-Za-z0-9_-]{3,20}$/,
    content: {
      post: /(?:reddit\.com\/r\/[A-Za-z0-9_]+\/comments|redd\.it)\/(\w+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d))
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
    return this.patterns.handle.test(handle.startsWith('u/') ? handle : `u/${handle}`)
  },

  buildProfileUrl(username: string): string {
    return `https://reddit.com/user/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''))
  },
}