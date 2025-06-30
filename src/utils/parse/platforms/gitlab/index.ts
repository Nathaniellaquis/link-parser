import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['gitlab.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const gitlab: PlatformModule = {
  id: Platforms.GitLab,
  name: 'GitLab',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]{2,255})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]{1,255}$/,
    content: {
      project: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]{2,255})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`, 'i'),
      snippet: new RegExp(`^https?://${DOMAIN_PATTERN}/[A-Za-z0-9-]+/[A-Za-z0-9._-]+/-/snippets/(\\d+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    return this.patterns.profile.test(url) ||
      !!(this.patterns.content?.project?.test(url)) ||
      !!(this.patterns.content?.snippet?.test(url))
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle snippet URLs
    const snippetMatch = this.patterns.content?.snippet?.exec(url)
    if (snippetMatch) {
      result.ids.snippetId = snippetMatch[1]
      result.metadata.isSnippet = true
      result.metadata.contentType = 'snippet'
      return
    }

    // Handle project URLs
    const projectMatch = this.patterns.content?.project?.exec(url)
    if (projectMatch) {
      result.username = projectMatch[1]
      result.ids.projectName = projectMatch[2]
      result.metadata.isProject = true
      result.metadata.contentType = 'project'
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
    return `https://gitlab.com/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}