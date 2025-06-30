import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['instagram.com', 'instagr.am']
const subdomains = ['m', 'mobile']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const instagram: PlatformModule = {
  id: Platforms.Instagram,
  name: 'Instagram',
  color: '#E1306C',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_.]{2,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]*[a-zA-Z0-9_])?$/i,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:[a-zA-Z0-9_.]{2,30}/)?p/([A-Za-z0-9_-]+)(?:/.*)?${QUERY_HASH}$`, 'i'),
      reel: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:[a-zA-Z0-9_.]{2,30}/)?reel[s]?/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
      story: new RegExp(`^https?://${DOMAIN_PATTERN}/stories/([a-zA-Z0-9_.]+)(?:/(\\d+))?/?${QUERY_HASH}$`, 'i'),
      tv: new RegExp(`^https?://${DOMAIN_PATTERN}/tv/([A-Za-z0-9_-]{1,})/?${QUERY_HASH}$`, 'i'),
      live: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_.]{2,30})/live/?${QUERY_HASH}$`, 'i'),
      embed: new RegExp(`^https?://${DOMAIN_PATTERN}/p/([A-Za-z0-9_-]+)/embed/?${QUERY_HASH}$`, 'i'),
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
    // Handle embed URLs first
    const embedMatch = this.patterns.content?.embed?.exec(url)
    if (embedMatch) {
      result.ids.postId = embedMatch[1]
      result.metadata.isEmbed = true
      result.metadata.contentType = 'embed'
      return
    }

    // Handle story URLs
    const storyMatch = this.patterns.content?.story?.exec(url)
    if (storyMatch) {
      result.ids.storyId = storyMatch[1] // username
      result.ids.storyItemId = storyMatch[2] // story item ID
      result.metadata.isStory = true
      result.metadata.contentType = 'story'
      return
    }

    // Handle live
    const liveMatch = this.patterns.content?.live?.exec(url)
    if (liveMatch) {
      result.username = liveMatch[1]
      result.metadata.isLive = true
      result.metadata.contentType = 'live'
      return
    }

    // Handle other content types
    if (this.patterns.content) {
      for (const [type, patternValue] of Object.entries(this.patterns.content)) {
        if (type === 'story' || type === 'embed') continue // already handled
        const pattern = patternValue as RegExp | undefined
        if (!pattern) continue
        const match = pattern.exec(url)
        if (match) {
          result.ids[`${type}Id`] = match[1]
          result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
          result.metadata.contentType = type
          return
        }
      }
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
    const cleaned = handle.replace('@', '')
    // Instagram usernames: 2-30 chars, alphanumeric, underscore, period
    // Can't start/end with period, no consecutive periods
    return /^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]{0,28}[a-zA-Z0-9_])?$/.test(cleaned)
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '')
    return `https://instagram.com/${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    const map: Record<string, string> = { post: 'p', reel: 'reel', tv: 'tv' }
    const path = map[contentType] || 'p'
    return `https://instagram.com/${path}/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](igshid|utm_[^&]+|ig_[^&]+)=[^&]+/g, ''))
  },

  getEmbedInfo(url: string, parsed) {
    if (/instagram\.com\/.*\/embed\//.test(url)) {
      return { embedUrl: url, isEmbedAlready: true }
    }
    const id = parsed.ids.postId || parsed.ids.reelId || parsed.ids.tvId
    if (id) {
      const embedUrl = `https://www.instagram.com/p/${id}/embed/`
      return { embedUrl, type: 'iframe' }
    }
    return null
  },
}