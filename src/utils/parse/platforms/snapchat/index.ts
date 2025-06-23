import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const snapchat: PlatformModule = {
  id: Platforms.Snapchat,
  name: 'Snapchat',
  color: '#FFFC00',

  domains: ['snapchat.com'],

  patterns: {
    profile: /snapchat\.com\/add\/([A-Za-z0-9._-]+)/i,
    handle: /^[A-Za-z0-9._-]{3,15}$/,
    content: {
      story: /snapchat\.com\/add\/([A-Za-z0-9._-]+)\?shareId=([a-f0-9-]+)/i,
    },
  },

  detect(url: string): boolean {
    return url.includes('snapchat.com')
  },

  extract(url: string, result: ParsedUrl): void {
    const storyMatch = this.patterns.content?.story?.exec(url)
    if (storyMatch) {
      result.username = storyMatch[1]
      result.ids.storyId = storyMatch[2]
      result.metadata.isStory = true
      result.metadata.contentType = 'story'
    } else {
      const profileMatch = this.patterns.profile.exec(url)
      if (profileMatch) {
        result.username = profileMatch[1]
        result.metadata.isProfile = true
        result.metadata.contentType = 'profile'
      }
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