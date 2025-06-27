import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

export const facebook: PlatformModule = {
  id: Platforms.Facebook,
  name: 'Facebook',
  color: '#1877F2',

  domains: ['facebook.com', 'fb.com'],
  mobileSubdomains: ['m', 'mobile'],

  patterns: {
    profile: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/([A-Za-z0-9.]{5,})\\/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9.]{5,}$/,
    content: {
      profileId: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/profile\\.php\\?id=(\\d+)\\/?${QUERY_HASH}$`, 'i'),
      page: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/pages\\/[^\\/]+\\/(\\d{2,})\\/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/[A-Za-z0-9.]+\\/posts\\/(\\d+)\\/?${QUERY_HASH}$`, 'i'),
      video: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/watch\\/\\?v=(\\d+)(?:&[^#]*)?\\/?${QUERY_HASH}$`, 'i'),
      group: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/groups\\/([A-Za-z0-9._-]{3,})\\/?${QUERY_HASH}$`, 'i'),
      event: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/events\\/(\\d+)\\/?${QUERY_HASH}$`, 'i'),
      live: new RegExp(`^https?:\\/\\/(?:www\\.)?(?:facebook\\.com|fb\\.com)\\/([A-Za-z0-9.]{5,})\\/live\\/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    if (this.patterns.profile.test(url)) return true
    for (const p of Object.values(this.patterns.content || {})) {
      if (p && p.test(url)) return true
    }
    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Handle profile ID URLs
    const profileIdMatch = this.patterns.content?.profileId?.exec(url)
    if (profileIdMatch) {
      result.ids.profileId = profileIdMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
      return
    }

    // Handle page URLs
    const pageMatch = this.patterns.content?.page?.exec(url)
    if (pageMatch) {
      result.ids.pageId = pageMatch[1]
      result.metadata.isPage = true
      result.metadata.contentType = 'page'
      return
    }

    // Handle video URLs (watch format)
    const videoMatch = this.patterns.content?.video?.exec(url)
    if (videoMatch) {
      result.ids.videoId = videoMatch[1]
      result.metadata.isVideo = true
      result.metadata.contentType = 'video'
      return
    }

    // Handle group URLs
    const groupMatch = this.patterns.content?.group?.exec(url)
    if (groupMatch) {
      result.ids.groupName = groupMatch[1]
      result.metadata.isGroup = true
      result.metadata.contentType = 'group'
      return
    }

    // Handle event URLs
    const eventMatch = this.patterns.content?.event?.exec(url)
    if (eventMatch) {
      result.ids.eventId = eventMatch[1]
      result.metadata.isEvent = true
      result.metadata.contentType = 'event'
      return
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url)
    if (postMatch) {
      result.ids.postId = postMatch[1]
      result.metadata.isPost = true
      result.metadata.contentType = 'post'
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

    // Handle profile URLs
    const reserved = ['/posts/', '/videos/', '/watch/', '/groups/', '/pages/', '/events/', '/profile.php']
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch && !reserved.some(r => url.includes(r))) {
      result.username = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://facebook.com/${username}`
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://facebook.com/watch/?v=${id}`
    }
    return `https://facebook.com/story.php?story_fbid=${id}`
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](mibextid|ref|refsrc|_rdc|_rdr|sfnsn|hc_ref)=[^&]+/g, '')
    return normalize(url)
  },
}