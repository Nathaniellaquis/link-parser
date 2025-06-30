import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['onlyfans.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const onlyfans: PlatformModule = {
  id: Platforms.OnlyFans,
  name: 'OnlyFans',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,60})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,60}$/,
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    return this.patterns.profile.test(url)
  },

  extract(url: string, res: ParsedUrl): void {
    const m = this.patterns.profile.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },

  validateHandle(h: string): boolean { return this.patterns.handle.test(h) },
  buildProfileUrl(u: string): string { return `https://onlyfans.com/${u}` },
  normalizeUrl(u: string): string { return normalize(u) },
}