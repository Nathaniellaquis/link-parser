import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const telegram: PlatformModule = {
  id: Platforms.Telegram,
  name: 'Telegram',
  color: '#0088CC',

  domains: ['t.me', 'telegram.me'],

  patterns: {
    profile: /^https?:\/\/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{5,32})$/i,
    handle: /^[A-Za-z0-9_]{5,32}$/,
    content: {
      channel: /^https?:\/\/(?:t\.me|telegram\.me)\/s\/([A-Za-z0-9_]{5,32})$/i,
      post: /^https?:\/\/(?:t\.me|telegram\.me)\/([A-Za-z0-9_]{5,32})\/(\d+)$/i,
      join: /^https?:\/\/(?:t\.me|telegram\.me)\/joinchat\/([A-Za-z0-9_-]{10,})$/i,
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle join links
    const joinMatch = this.patterns.content?.join?.exec(url)
    if (joinMatch) {
      result.ids.joinCode = joinMatch[1]
      result.metadata.isJoin = true
      result.metadata.contentType = 'join'
      return
    }

    // Handle channel URLs
    const channelMatch = this.patterns.content?.channel?.exec(url)
    if (channelMatch) {
      result.ids.channelName = channelMatch[1]
      result.metadata.isChannel = true
      result.metadata.contentType = 'channel'
      return
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.channelName = postMatch[1]
      result.ids.postId = postMatch[2]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
      return
    }

    // Handle profile URLs
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