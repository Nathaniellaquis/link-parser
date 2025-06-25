import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const linkedin: PlatformModule = {
  id: Platforms.LinkedIn,
  name: 'LinkedIn',
  color: '#0A66C2',

  domains: ['linkedin.com'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?linkedin\.com\/in\/([A-Za-z0-9-_%]{3,100})$/i,
    handle: /^[A-Za-z0-9-]{3,100}$/,
    content: {
      company: /^https?:\/\/(?:www\.)?linkedin\.com\/company\/([A-Za-z0-9-]+)$/i,
      school: /^https?:\/\/(?:www\.)?linkedin\.com\/school\/([A-Za-z0-9-]+)$/i,
      post: /^https?:\/\/(?:www\.)?linkedin\.com\/posts\/[A-Za-z0-9-_%]+_(.+)$/i,
      article: /^https?:\/\/(?:www\.)?linkedin\.com\/pulse\/([A-Za-z0-9-]+)$/i,
      feedUpdate: /^https?:\/\/(?:www\.)?linkedin\.com\/feed\/update\/urn:li:activity:(\d+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('linkedin.com')) return false

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
    // Handle company URLs
    const companyMatch = this.patterns.content?.company?.exec(url)
    if (companyMatch) {
      result.ids.companyName = companyMatch[1]
      result.metadata.isCompany = true
      result.metadata.contentType = 'company'
      return
    }

    // Handle school URLs
    const schoolMatch = this.patterns.content?.school?.exec(url)
    if (schoolMatch) {
      result.ids.schoolName = schoolMatch[1]
      result.metadata.isSchool = true
      result.metadata.contentType = 'school'
      return
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.postId = postMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
      return
    }

    // Handle article URLs
    const articleMatch = this.patterns.content?.article?.exec(url)
    if (articleMatch) {
      result.ids.articleSlug = articleMatch[1]
      result.metadata.isArticle = true
      result.metadata.contentType = 'article'
      return
    }

    // Handle feed update URLs
    const feedMatch = this.patterns.content?.feedUpdate?.exec(url)
    if (feedMatch) {
      result.ids.postId = feedMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
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
    return `https://linkedin.com/in/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]trk=[^&]+/g, ''))
  },
}