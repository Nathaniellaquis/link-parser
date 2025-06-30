import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['github.com', 'gist.github.com', 'raw.githubusercontent.com']

export const github: PlatformModule = {
  id: Platforms.GitHub,
  name: 'GitHub',
  domains: domains,
  patterns: {
    profile: new RegExp(`^https?://github\\.com/([A-Za-z0-9-]{2,39})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]{1,39}$/,
    content: {
      repo: new RegExp(`^https?://github\\.com/([A-Za-z0-9-]{2,39})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`, 'i'),
      gist: new RegExp(`^https?://gist\\.github\\.com/([A-Za-z0-9-]{2,39})/([a-fA-F0-9]{8,})/?${QUERY_HASH}$`, 'i'),
      raw: new RegExp(`^https?://raw\\.githubusercontent\\.com/([A-Za-z0-9-]{2,39})/([A-Za-z0-9._-]+)/(.+)${QUERY_HASH}$`, 'i'),
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

  extract(url: string, result: ParsedUrl): void {
    // Handle gist URLs
    const gistMatch = this.patterns.content?.gist?.exec(url)
    if (gistMatch) {
      result.username = gistMatch[1]
      result.ids.gistId = gistMatch[2]
      result.metadata.isGist = true
      result.metadata.contentType = 'gist'
      return
    }

    // Handle raw URLs
    const rawMatch = this.patterns.content?.raw?.exec(url)
    if (rawMatch) {
      result.username = rawMatch[1]
      result.ids.repoName = rawMatch[2]
      result.metadata.isRaw = true
      result.metadata.contentType = 'raw'
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
    return `https://github.com/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/^http:\/\//, 'https://'))
  },
}