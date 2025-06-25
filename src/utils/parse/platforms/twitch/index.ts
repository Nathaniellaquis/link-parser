import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const twitch: PlatformModule = {
  id: Platforms.Twitch,
  name: 'Twitch',
  color: '#9146FF',

  domains: ['twitch.tv', 'clips.twitch.tv'],

  patterns: {
    profile: /^https?:\/\/(?:www\.)?twitch\.tv\/([A-Za-z0-9_]{4,25})$/i,
    handle: /^[A-Za-z0-9_]{4,25}$/,
    content: {
      video: /^https?:\/\/(?:www\.)?twitch\.tv\/videos\/(\d+)$/i,
      clip: /^https?:\/\/clips\.twitch\.tv\/([A-Za-z0-9_-]+)$/i,
      collection: /^https?:\/\/(?:www\.)?twitch\.tv\/collections\/([A-Za-z0-9]{2,})$/i,
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
    // Handle video URLs
    const videoMatch = this.patterns.content?.video?.exec(url)
    if (videoMatch) {
      result.ids.videoId = videoMatch[1]
      result.metadata.isVideo = true
      result.metadata.contentType = 'video'
      return
    }

    // Handle clip URLs
    const clipMatch = this.patterns.content?.clip?.exec(url)
    if (clipMatch) {
      result.ids.clipName = clipMatch[1]
      result.metadata.isClip = true
      result.metadata.contentType = 'clip'
      return
    }

    // Handle collection URLs
    const collectionMatch = this.patterns.content?.collection?.exec(url)
    if (collectionMatch) {
      result.ids.collectionId = collectionMatch[1]
      result.metadata.isCollection = true
      result.metadata.contentType = 'collection'
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
    return `https://twitch.tv/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}