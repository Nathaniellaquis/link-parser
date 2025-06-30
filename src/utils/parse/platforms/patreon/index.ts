import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['patreon.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const patreon: PlatformModule = {
  id: Platforms.Patreon,
  name: 'Patreon',
  color: '#F96854',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:c/)?([A-Za-z0-9_-]{3,50})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,50}$/,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/posts/([A-Za-z0-9-]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    return this.patterns.profile.test(url) || !!(this.patterns.content?.post?.test(url))
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