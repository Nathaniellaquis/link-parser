import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const github: PlatformModule = {
  id: Platforms.GitHub,
  name: 'GitHub',
  domains: ['github.com', 'gist.github.com', 'raw.githubusercontent.com'],
  patterns: {
    profile: /^https?:\/\/github\.com\/([A-Za-z0-9-]{2,39})$/i,
    handle: /^[A-Za-z0-9-]{1,39}$/,
    content: {
      repo: /^https?:\/\/github\.com\/([A-Za-z0-9-]{2,39})\/([A-Za-z0-9._-]+)$/i,
      gist: /^https?:\/\/gist\.github\.com\/([A-Za-z0-9-]{2,39})\/([a-fA-F0-9]{2,})$/i,
      raw: /^https?:\/\/raw\.githubusercontent\.com\/([A-Za-z0-9-]{2,39})\/([A-Za-z0-9._-]+)\/(.+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false

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
    return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
  },
}