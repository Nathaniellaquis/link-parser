import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['youtube.com', 'youtu.be', 'youtube-nocookie.com']
const subdomains = ['m', 'mobile']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const youtube: PlatformModule = {
  id: Platforms.YouTube,
  name: 'YouTube',
  color: '#FF0000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:c/|user/|@)([a-zA-Z0-9_-]{2,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
    content: {
      channel: new RegExp(`^https?://${DOMAIN_PATTERN}/channel/(UC[a-zA-Z0-9_-]{17,22})/?${QUERY_HASH}$`, 'i'),
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/watch\\?v=([a-zA-Z0-9_-]{11})(?:&.*)?${QUERY_HASH}$`, 'i'),
      videoShort: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`, 'i'),
      short: new RegExp(`^https?://${DOMAIN_PATTERN}/shorts/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`, 'i'),
      playlist: new RegExp(`^https?://${DOMAIN_PATTERN}/playlist\\?list=([a-zA-Z0-9_-]+)(?:&.*)?${QUERY_HASH}$`, 'i'),
      live: new RegExp(`^https?://${DOMAIN_PATTERN}/live/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`, 'i'),
      liveWatch: new RegExp(`^https?://${DOMAIN_PATTERN}/watch\\?v=([a-zA-Z0-9_-]{11})&.*\\blive=1(?:&.*)?${QUERY_HASH}$`, 'i'),
      channelLive: new RegExp(`^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9_-]+)/live/?${QUERY_HASH}$`, 'i'),
      embed: new RegExp(`^https?://${DOMAIN_PATTERN}/embed/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`, 'i'),
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
    // Handle channel URLs
    const channelMatch = this.patterns.content?.channel?.exec(url)
    if (channelMatch) {
      result.ids.channelId = channelMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'channel'
      return
    }

    // Handle embed URLs
    const embedMatch = this.patterns.content?.embed?.exec(url)
    if (embedMatch) {
      result.ids.videoId = embedMatch[1]
      result.metadata.isEmbed = true
      result.metadata.contentType = 'embed'
      return
    }

    // Handle live videos first to avoid matching the generic video pattern
    const liveMatch = this.patterns.content?.live?.exec(url) || this.patterns.content?.liveWatch?.exec(url) || this.patterns.content?.channelLive?.exec(url)
    if (liveMatch) {
      // For /@user/live the capturing group is username not videoId, treat accordingly
      if (url.includes('/@') && url.endsWith('/live')) {
        result.username = liveMatch[1]
      } else {
        result.ids.liveId = liveMatch[1]
      }
      result.metadata.isLive = true
      result.metadata.contentType = 'live'
      return
    }

    // Handle video URLs (both regular and short)
    const videoMatch = this.patterns.content?.video?.exec(url)
    const videoShortMatch = this.patterns.content?.videoShort?.exec(url)
    if (videoMatch || videoShortMatch) {
      const match = videoMatch || videoShortMatch
      result.ids.videoId = match![1]
      result.metadata.isVideo = true
      result.metadata.contentType = 'video'

      // Extract timestamp if present
      const tMatch = url.match(/[?&]t=(\d+)/)
      if (tMatch) result.metadata.timestamp = parseInt(tMatch[1])
      return
    }

    // Handle shorts
    const shortMatch = this.patterns.content?.short?.exec(url)
    if (shortMatch) {
      result.ids.shortId = shortMatch[1]
      result.metadata.isShort = true
      result.metadata.contentType = 'short'
      return
    }

    // Handle playlists
    const playlistMatch = this.patterns.content?.playlist?.exec(url)
    if (playlistMatch) {
      result.ids.playlistId = playlistMatch[1]
      result.metadata.isPlaylist = true
      result.metadata.contentType = 'playlist'
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
    const clean = username.replace('@', '')
    if (clean.startsWith('UC') && clean.length === 24) {
      return `https://youtube.com/channel/${clean}`
    }
    return `https://youtube.com/@${clean}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (['video', 'short', 'live'].includes(contentType)) return `https://youtube.com/watch?v=${id}`
    if (contentType === 'playlist') return `https://youtube.com/playlist?list=${id}`
    return `https://youtube.com/watch?v=${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](feature|si|pp|ab_channel)=[^&]+/g, '')
    return normalize(url)
  },

  extractTimestamp(url: string): number | null {
    const match = url.match(/[?&]t=(\d+)/)
    return match ? parseInt(match[1]) : null
  },

  generateEmbedUrl(contentId: string, options?: { startTime?: number; autoplay?: boolean }): string {
    const params = new URLSearchParams()
    if (options?.startTime) params.set('start', options.startTime.toString())
    if (options?.autoplay) params.set('autoplay', '1')
    const qs = params.toString()
    return `https://www.youtube.com/embed/${contentId}${qs ? `?${qs}` : ''}`
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    const match = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(shortUrl)
    if (match) return `https://youtube.com/watch?v=${match[1]}`
    return shortUrl
  },

  getEmbedInfo(url: string, parsed) {
    // If already an embed src
    const embedMatch = /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/.exec(url)
    if (embedMatch) {
      return { embedUrl: url, isEmbedAlready: true }
    }
    const id = parsed.ids.videoId || parsed.ids.shortId || parsed.ids.liveId
    if (id) {
      const embedUrl = this.generateEmbedUrl ? this.generateEmbedUrl(id) : `https://www.youtube.com/embed/${id}`
      return { embedUrl, type: 'iframe' }
    }
    return null
  },
}