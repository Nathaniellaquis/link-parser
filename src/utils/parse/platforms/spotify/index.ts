import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const spotify: PlatformModule = {
  id: Platforms.Spotify,
  name: 'Spotify',
  color: '#1DB954',

  domains: ['spotify.com', 'open.spotify.com'],

  patterns: {
    profile: /open\.spotify\.com\/(?:user|artist)\/([A-Za-z0-9]+)/i,
    handle: /^[A-Za-z0-9]{3,32}$/,
    content: {
      track: /open\.spotify\.com\/track\/([A-Za-z0-9]+)/i,
      playlist: /open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/i,
      album: /open\.spotify\.com\/album\/([A-Za-z0-9]+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d))
  },

  extract(url: string, result: ParsedUrl): void {
    for (const [type, patternValue] of Object.entries(this.patterns.content || {})) {
      const pattern = patternValue as RegExp | undefined
      if (!pattern) continue
      const match = pattern.exec(url)
      if (match) {
        result.ids[`${type}Id`] = match[1]
        result.metadata.contentType = type
        result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true
        break
      }
    }

    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.userId = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://open.spotify.com/user/${username}`
  },

  buildContentUrl(contentType: string, id: string): string {
    return `https://open.spotify.com/${contentType}/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](si|utm_[^&]+)=[^&]+/g, ''))
  },
}