import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['snapchat.com']
const subdomains = ['story']  // story.snapchat.com

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const snapchat: PlatformModule = {
  id: Platforms.Snapchat,
  name: 'Snapchat',
  color: '#FFFC00',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/add/([A-Za-z0-9._-]{3,15})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9._-]{3,15}$/,
    content: {
      story: new RegExp(`^https?://${DOMAIN_PATTERN}/s/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`, 'i'),
      spotlight: new RegExp(`^https?://${DOMAIN_PATTERN}/spotlight/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
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
    // Handle story URLs
    const storyMatch = this.patterns.content?.story?.exec(url)
    if (storyMatch) {
      result.ids.storyId = storyMatch[1]
      result.metadata.isStory = true
      result.metadata.contentType = 'story'
      return
    }

    // Handle spotlight URLs
    const spotlightMatch = this.patterns.content?.spotlight?.exec(url)
    if (spotlightMatch) {
      result.ids.spotlightId = spotlightMatch[1]
      result.metadata.isSpotlight = true
      result.metadata.contentType = 'spotlight'
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
    return this.patterns.handle.test(handle.replace('@', ''))
  },

  buildProfileUrl(username: string): string {
    return `https://snapchat.com/add/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}