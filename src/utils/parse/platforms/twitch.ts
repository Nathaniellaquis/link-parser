import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const twitch: PlatformModule = {
  id: Platforms.Twitch,
  name: 'Twitch',
  color: '#9146FF',

  domains: ['twitch.tv'],

  patterns: {
    profile: /twitch\.tv\/([A-Za-z0-9_]+)/i,
    handle: /^[A-Za-z0-9_]{4,25}$/,
    content: {
      video: /twitch\.tv\/videos\/(\d+)/i,
      clip: /clips\.twitch\.tv\/([A-Za-z0-9]+)/i,
    },
  },

  detect(url: string): boolean {
    return url.includes('twitch.tv')
  },

  extract(url: string, result: ParsedUrl): void {
    for (const [type, patternValue] of Object.entries(this.patterns.content || {})) {
      const pattern = patternValue as RegExp | undefined
      if (!pattern) continue
      const match = pattern.exec(url)
      if (match) {
        result.ids[`${type}Id`] = match[1]
        result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
        result.metadata.contentType = type
        break
      }
    }

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
    return `https://twitch.tv/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}