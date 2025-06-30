import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['bitbucket.org']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const bitbucket: PlatformModule = {
  id: Platforms.Bitbucket,
  name: 'Bitbucket',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{2,30}$/,
    content: {
      repo: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,30})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`, 'i'),
      snippet: new RegExp(`^https?://${DOMAIN_PATTERN}/snippets/([A-Za-z0-9_-]{2,30})/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    return this.patterns.profile.test(url) ||
      !!(this.patterns.content?.repo?.test(url)) ||
      !!(this.patterns.content?.snippet?.test(url))
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle snippet URLs
    const snippetMatch = this.patterns.content?.snippet?.exec(url)
    if (snippetMatch) {
      result.username = snippetMatch[1]
      result.ids.snippetId = snippetMatch[2]
      result.metadata.isSnippet = true
      result.metadata.contentType = 'snippet'
      return
    }

    // Handle repo URLs
    const repoMatch = this.patterns.content?.repo?.exec(url)
    if (repoMatch) {
      result.username = repoMatch[1]
      result.ids.repoName = repoMatch[2]
      result.metadata.isRepo = true
      result.metadata.contentType = 'repo'
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
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://bitbucket.org/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}