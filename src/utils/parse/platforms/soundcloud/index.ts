import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const soundcloud: PlatformModule = {
  id: Platforms.SoundCloud,
  name: 'SoundCloud',
  color: '#FF5500',

  domains: ['soundcloud.com', 'w.soundcloud.com'],

  patterns: {
    profile: /^https?:\/\/(www\.)?soundcloud\.com\/([A-Za-z0-9_-]{2,25})$/i,
    handle: /^[A-Za-z0-9_-]{2,25}$/,
    content: {
      track: /^https?:\/\/(www\.)?soundcloud\.com\/([A-Za-z0-9_-]{2,25})\/([A-Za-z0-9_-]+)$/i,
      set: /^https?:\/\/(www\.)?soundcloud\.com\/([A-Za-z0-9_-]{2,25})\/sets\/([A-Za-z0-9_-]+)$/i,
      embed: /^https?:\/\/w\.soundcloud\.com\/player\/\?url=/i,
    },
  },

  detect(url: string): boolean {
    // Must be a valid soundcloud domain
    if (!url.includes('soundcloud.com')) return false

    // Check if it matches any valid pattern
    if (this.patterns.content?.embed?.test(url)) return true
    if (this.patterns.content?.set?.test(url)) return true
    if (this.patterns.content?.track?.test(url)) return true
    if (this.patterns.profile.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for embed URL first
    if (this.patterns.content?.embed?.test(url)) {
      result.metadata.contentType = 'embed'
      result.metadata.isEmbed = true
      return
    }

    // Check for set/playlist
    const setMatch = this.patterns.content?.set?.exec(url)
    if (setMatch) {
      result.username = setMatch[2]
      result.ids.setId = setMatch[3]
      result.metadata.contentType = 'set'
      return
    }

    // Check for track
    const trackMatch = this.patterns.content?.track?.exec(url)
    if (trackMatch) {
      result.username = trackMatch[2]
      result.ids.trackId = trackMatch[3]
      result.metadata.contentType = 'track'
      return
    }

    // Check for profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[2]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
      return
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

  getEmbedInfo(url: string, parsed: ParsedUrl) {
    if (url.includes('w.soundcloud.com/player')) {
      return { embedUrl: url, isEmbedAlready: true }
    }
    const id = parsed.ids.trackId
    if (id) {
      const embedUrl = this.generateEmbedUrl ? this.generateEmbedUrl(id) : `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}`
      return { embedUrl, type: 'iframe' }
    }
    return null
  },
}