import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['t.me', 'telegram.me']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const telegram: PlatformModule = {
  id: Platforms.Telegram,
  name: 'Telegram',
  color: '#0088CC',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{5,32})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{5,32}$/,
    content: {
      channel: new RegExp(`^https?://${DOMAIN_PATTERN}/s/([A-Za-z0-9_]{5,32})/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{5,32})/(\\d+)/?${QUERY_HASH}$`, 'i'),
      join: new RegExp(`^https?://${DOMAIN_PATTERN}/joinchat/([A-Za-z0-9_-]{10,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false
    return this.patterns.profile.test(url) ||
      !!(this.patterns.content?.channel?.test(url)) ||
      !!(this.patterns.content?.post?.test(url)) ||
      !!(this.patterns.content?.join?.test(url))
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