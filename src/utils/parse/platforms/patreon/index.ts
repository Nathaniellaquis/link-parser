import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const patreon: PlatformModule = {
  id: Platforms.Patreon,
  name: 'Patreon',
  color: '#F96854',

  domains: ['patreon.com'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?patreon\.com\/(?:c\/)?([A-Za-z0-9_-]{3,50})$/i,
    handle: /^[A-Za-z0-9_-]{3,50}$/,
    content: {
      post: /^https?:\/\/(?:www\.)?patreon\.com\/posts\/([A-Za-z0-9-]{2,})$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('patreon.com')) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content?.post?.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.postId = postMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
      return
    }

    // Handle profile URLs (both regular and /c/ creator URLs)
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