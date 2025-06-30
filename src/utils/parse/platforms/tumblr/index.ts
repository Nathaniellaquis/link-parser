import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['tumblr.com']
const subdomains: string[] = []

// Note: DOMAIN_PATTERN not used for Tumblr due to complex dual URL format requirements

export const tumblr: PlatformModule = {
  id: Platforms.Tumblr,
  name: 'Tumblr',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Subdomain format: https://username.tumblr.com
    profile: new RegExp(`^https?://([a-zA-Z0-9-]{3,})\\.tumblr\\.com/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9-]{3,}$/,
    content: {
      // Subdomain post format: https://username.tumblr.com/post/123456789/optional-title
      post: new RegExp(`^https?://([a-zA-Z0-9-]+)\\.tumblr\\.com/post/(\\d+)(?:/[^?#]*)?/?${QUERY_HASH}$`, 'i'),
      // Path format: https://tumblr.com/username
      profileBlog: new RegExp(`^https?://(?:www\\.)?tumblr\\.com/([a-zA-Z0-9-]{3,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!domains.some((domain: string) => url.includes(domain))) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    return false
  },

  extract(url: string, res: ParsedUrl): void {
    // Handle post URLs first
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      res.username = postMatch[1]
      res.ids.postId = postMatch[2]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle subdomain profile URLs
    const subdomainMatch = this.patterns.profile.exec(url)
    if (subdomainMatch) {
      res.username = subdomainMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
      return
    }

    // Handle path profile URLs: https://tumblr.com/username
    const pathMatch = this.patterns.content?.profileBlog?.exec(url)
    if (pathMatch) {
      res.username = pathMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },

  validateHandle(h: string): boolean {
    return /^[a-zA-Z0-9-]{3,}$/.test(h)
  },

  buildProfileUrl(u: string): string {
    return `https://${u}.tumblr.com`
  },

  normalizeUrl(u: string): string {
    return normalize(u)
  },
}