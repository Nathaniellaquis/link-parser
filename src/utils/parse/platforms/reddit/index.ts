import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['reddit.com', 'redd.it']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains)

export const reddit: PlatformModule = {
  id: Platforms.Reddit,
  name: 'Reddit',
  color: '#FF4500',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:user|u)/([A-Za-z0-9_-]{3,20})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,20}$/,
    content: {
      subreddit: new RegExp(`^https?://${DOMAIN_PATTERN}/r/([A-Za-z0-9_]{3,21})/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/r/[A-Za-z0-9_]+/comments/([a-z0-9]{2,})(?:/[^?#]+)?/?${QUERY_HASH}$`, 'i'),
      shortPost: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    if (this.patterns.profile.test(url)) return true
    for (const p of Object.values(this.patterns.content || {})) {
      if (p && p.test(url)) return true
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