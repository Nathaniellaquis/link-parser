import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const telegram: PlatformModule = {
  id: Platforms.Telegram,
  name: 'Telegram',
  color: '#0088CC',

  domains: ['t.me', 'telegram.me'],

  patterns: {
    profile: /(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)/i,
    handle: /^[A-Za-z0-9_]{5,32}$/,
    content: {
      post: /(?:t\.me|telegram\.me)\/[A-Za-z0-9_]+\/(\d+)/i,
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
    return this.patterns.handle.test(handle.replace('@', ''))
  },

  buildProfileUrl(username: string): string {
    return `https://t.me/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}