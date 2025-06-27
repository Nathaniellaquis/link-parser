import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

export const reddit: PlatformModule = {
  id: Platforms.Reddit,
  name: 'Reddit',
  color: '#FF4500',

  domains: ['reddit.com', 'redd.it'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?reddit\.com\/(?:user|u)\/([A-Za-z0-9_-]{3,20})$/i,
    handle: /^[A-Za-z0-9_-]{3,20}$/,
    content: {
      subreddit: /^https?:\/\/(?:www\.)?reddit\.com\/r\/([A-Za-z0-9_]{3,21})$/i,
      post: new RegExp(`^https?:\\/\\/(?:www\\.)?reddit\\.com\\/r\\/[A-Za-z0-9_]+\\/comments\\/([a-z0-9]{2,})(?:\\/[^?#]+)?\\/?${QUERY_HASH}$`, 'i'),
      shortPost: /^https?:\/\/redd\.it\/([a-z0-9]{2,})$/i,
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
    // Handle subreddit URLs
    const subredditMatch = this.patterns.content?.subreddit?.exec(url)
    if (subredditMatch) {
      result.ids.subreddit = subredditMatch[1]
      result.metadata.isSubreddit = true
      result.metadata.contentType = 'subreddit'
      return
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.postId = postMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
      return
    }

    // Handle short post URLs
    const shortPostMatch = this.patterns.content?.shortPost?.exec(url)
    if (shortPostMatch) {
      result.ids.postId = shortPostMatch[1]
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
    const cleaned = handle.replace(/^u\//, '')
    return /^[A-Za-z0-9_-]{3,20}$/.test(cleaned)
  },

  buildProfileUrl(username: string): string {
    return `https://reddit.com/user/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''))
  },
}