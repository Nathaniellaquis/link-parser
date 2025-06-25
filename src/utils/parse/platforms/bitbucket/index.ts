import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bitbucket: PlatformModule = {
  id: Platforms.Bitbucket,
  name: 'Bitbucket',
  domains: ['bitbucket.org'],
  patterns: {
    profile: /^https?:\/\/bitbucket\.org\/([A-Za-z0-9_-]{2,30})$/i,
    handle: /^[A-Za-z0-9_-]{2,30}$/,
    content: {
      repo: /^https?:\/\/bitbucket\.org\/([A-Za-z0-9_-]{2,30})\/([A-Za-z0-9._-]+)$/i,
      snippet: /^https?:\/\/bitbucket\.org\/snippets\/([A-Za-z0-9_-]{2,30})\/([A-Za-z0-9]{2,})$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('bitbucket.org')) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content?.repo?.test(url)) return true
    if (this.patterns.content?.snippet?.test(url)) return true

    return false
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
    return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
  },
}