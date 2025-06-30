import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['threads.net']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const threads: PlatformModule = {
  id: Platforms.Threads,
  name: 'Threads',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9._]{2,30})/?(?!post/)${QUERY_HASH}$`, 'i'),
    handle: /^@?[a-zA-Z0-9._]{2,30}$/,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9._]{2,30})/post/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
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

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      res.username = profileMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },

  validateHandle(h: string): boolean {
    return /^@?[a-zA-Z0-9._]{2,30}$/i.test(h)
  },

  buildProfileUrl(u: string): string {
    return `https://threads.net/@${u.replace('@', '')}`
  },

  normalizeUrl(u: string): string {
    return normalize(u)
  },
}