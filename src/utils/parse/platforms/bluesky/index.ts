import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['bsky.app']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const bluesky: PlatformModule = {
  id: Platforms.Bluesky,
  name: 'Bluesky',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/profile/([a-zA-Z0-9.-]+\\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/profile/([a-zA-Z0-9.-]+\\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)/post/([a-zA-Z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    return this.patterns.profile.test(url) || !!(this.patterns.content?.post?.test(url))
  },

  extract(url: string, res: ParsedUrl): void {
    // Handle post URLs
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
    // Check if it's a regular handle or a DID
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(h) || /^did:[a-z]+:[a-zA-Z0-9]+$/.test(h)
  },

  buildProfileUrl(u: string): string {
    // Add default domain if not present
    const handle = u.includes('.') || u.startsWith('did:') ? u : `${u}.bsky.social`
    return `https://bsky.app/profile/${handle}`
  },

  normalizeUrl(u: string): string { return normalize(u) },
}