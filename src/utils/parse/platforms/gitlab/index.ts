import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const gitlab: PlatformModule = {
  id: Platforms.GitLab,
  name: 'GitLab',
  domains: ['gitlab.com'],
  patterns: {
    profile: /^https?:\/\/gitlab\.com\/([A-Za-z0-9-]{2,255})$/i,
    handle: /^[A-Za-z0-9-]{1,255}$/,
    content: {
      project: /^https?:\/\/gitlab\.com\/([A-Za-z0-9-]{2,255})\/([A-Za-z0-9._-]+)$/i,
      snippet: /^https?:\/\/gitlab\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/-\/snippets\/(\d+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('gitlab.com')) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content?.project?.test(url)) return true
    if (this.patterns.content?.snippet?.test(url)) return true

    return false
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
    return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
  },
}