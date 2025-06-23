import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const patreon: PlatformModule = {
  id: Platforms.Patreon,
  name: 'Patreon',
  color: '#F96854',

  domains: ['patreon.com'],

  patterns: {
    profile: /patreon\.com\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]{3,50}$/,
    content: {
      post: /patreon\.com\/posts\/(\d+)/i,
    },
  },

  detect(url: string): boolean {
    return url.includes('patreon.com')
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
    return `https://patreon.com/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}