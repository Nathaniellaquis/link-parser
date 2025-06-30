import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['ko-fi.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const kofi: PlatformModule = {
  id: Platforms.KoFi,
  name: 'Ko-fi',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Profile pattern should NOT allow trailing slash - use negative lookahead
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,})(?!/)${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{2,}$/,
    content: {
      shop: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]+)/shop/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/post/([A-Za-z0-9-]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false

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
      res.ids.postId = postMatch[1]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle shop URLs
    const shopMatch = this.patterns.content?.shop?.exec(url)
    if (shopMatch) {
      res.username = shopMatch[1]
      res.ids.shop = 'shop'
      res.metadata.isShop = true
      res.metadata.contentType = 'shop'
      return
    }

    // Handle profile URLs 
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      res.username = profileMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },

  validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
  buildProfileUrl: (u: string): string => `https://ko-fi.com/${u}`,
  normalizeUrl: (u: string): string => normalize(u),
}