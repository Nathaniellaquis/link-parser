import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const twitter: PlatformModule = {
  id: Platforms.Twitter,
  name: 'Twitter',
  color: '#1DA1F2',

  domains: ['twitter.com', 'x.com'],
  mobileSubdomains: ['m', 'mobile'],

  patterns: {
    profile: /(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/i,
    handle: /^@[A-Za-z0-9_]{1,15}$/,
    content: {
      post: /(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/i,
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
    if (profileMatch && !/\/status\//.test(url)) {
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
    return `https://x.com/${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') {
      return `https://x.com/i/status/${id}`
    }
    return `https://x.com/${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace('twitter.com', 'x.com')
    url = url.replace(/[?&](s|t|ref_src)=[^&]+/g, '')
    return normalize(url)
  },
}