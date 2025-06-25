import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const snapchat: PlatformModule = {
  id: Platforms.Snapchat,
  name: 'Snapchat',
  color: '#FFFC00',

  domains: ['snapchat.com', 'story.snapchat.com'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?snapchat\.com\/add\/([A-Za-z0-9._-]{3,15})$/i,
    handle: /^[A-Za-z0-9._-]{3,15}$/,
    content: {
      story: /^https?:\/\/story\.snapchat\.com\/s\/([A-Za-z0-9._-]+)$/i,
      spotlight: /^https?:\/\/(?:www\.)?snapchat\.com\/spotlight\/([A-Za-z0-9]{2,})$/i,
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