import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const soundcloud: PlatformModule = {
  id: Platforms.SoundCloud,
  name: 'SoundCloud',
  color: '#FF5500',

  domains: ['soundcloud.com'],

  patterns: {
    profile: /soundcloud\.com\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]{3,25}$/,
    content: {
      track: /soundcloud\.com\/[A-Za-z0-9_-]+\/([A-Za-z0-9_-]+)/i,
    },
  },

  detect(url: string): boolean {
    return url.includes('soundcloud.com')
  },

  extract(url: string, result: ParsedUrl): void {
    const trackMatch = this.patterns.content?.track?.exec(url)
    if (trackMatch) {
      result.ids.trackId = trackMatch[1]
      result.metadata.contentType = 'track'
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
    return `https://soundcloud.com/${username}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'track') {
      return `https://soundcloud.com/track/${id}`
    }
    return `https://soundcloud.com/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''))
  },

  generateEmbedUrl(contentId: string): string {
    return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${contentId}`
  },
}