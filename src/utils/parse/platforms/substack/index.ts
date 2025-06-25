import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const substack: PlatformModule = {
  id: Platforms.Substack,
  name: 'Substack',
  color: '#FF6719',

  domains: ['substack.com'],

  patterns: {
    profile: /^https?:\/\/([a-z0-9-]{2,})\.substack\.com\/?$/i,
    handle: /^[a-z0-9-]{2,}$/i,
    content: {
      post: /^https?:\/\/([a-z0-9-]{2,})\.substack\.com\/p\/([a-z0-9-]+)$/i,
      profileNew: /^https?:\/\/substack\.com\/@([a-z0-9-]{2,})$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('substack.com')) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content?.post?.test(url)) return true
    if (this.patterns.content?.profileNew?.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for new profile format
    const profileNewMatch = this.patterns.content?.profileNew?.exec(url)
    if (profileNewMatch) {
      result.username = profileNewMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'newsletter'
      return
    }

    // Check for post
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.username = postMatch[1]
      result.ids.postSlug = postMatch[2]
      result.metadata.contentType = 'post'
      return
    }

    // Check for old profile format
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'newsletter'
      return
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://${username}.substack.com`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') {
      return `https://substack.com/p/${id}`
    }
    return `https://substack.com/${contentType}/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}