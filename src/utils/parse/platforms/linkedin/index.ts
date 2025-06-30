import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['linkedin.com']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains)

export const linkedin: PlatformModule = {
  id: Platforms.LinkedIn,
  name: 'LinkedIn',
  color: '#0A66C2',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/in/([A-Za-z0-9-_%]{3,100})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]{3,100}$/,
    content: {
      company: new RegExp(`^https?://${DOMAIN_PATTERN}/company/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
      school: new RegExp(`^https?://${DOMAIN_PATTERN}/school/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/posts/[A-Za-z0-9-_%]+_(.+?)/?${QUERY_HASH}$`, 'i'),
      article: new RegExp(`^https?://${DOMAIN_PATTERN}/pulse/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
      feedUpdate: new RegExp(`^https?://${DOMAIN_PATTERN}/feed/update/urn:li:activity:(\\d+)/?${QUERY_HASH}$`, 'i'),
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