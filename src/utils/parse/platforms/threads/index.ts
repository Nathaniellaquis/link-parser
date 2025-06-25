import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const threads: PlatformModule = {
  id: Platforms.Threads,
  name: 'Threads',
  domains: ['threads.net'],
  patterns: {
    profile: /^https?:\/\/(?:www\.)?threads\.net\/@([a-zA-Z0-9._]{2,30})$/i,
    handle: /^@?[a-zA-Z0-9._]{2,30}$/,
    content: {
      post: /^https?:\/\/(?:www\.)?threads\.net\/@([a-zA-Z0-9._]{2,30})\/post\/([A-Za-z0-9]{2,})$/i,
    },
  },
  detect: (url: string): boolean => {
    if (!url.includes('threads.net')) return false

    // Check if it matches any valid pattern
    if (/^https?:\/\/(?:www\.)?threads\.net\/@[a-zA-Z0-9._]{2,30}(?:\/post\/[A-Za-z0-9]{2,})?$/i.test(url)) {
      return true
    }

    return false
  },
  extract: (url: string, res: ParsedUrl) => {
    // Handle post URLs
    const postMatch = /^https?:\/\/(?:www\.)?threads\.net\/@([a-zA-Z0-9._]{2,30})\/post\/([A-Za-z0-9]{2,})$/i.exec(url)
    if (postMatch) {
      res.username = postMatch[1]
      res.ids.postId = postMatch[2]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle profile URLs
    const profileMatch = /^https?:\/\/(?:www\.)?threads\.net\/@([a-zA-Z0-9._]{2,30})$/i.exec(url)
    if (profileMatch) {
      res.username = profileMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: (h: string): boolean => /^@?[a-zA-Z0-9._]{2,30}$/i.test(h),
  buildProfileUrl: (u: string): string => `https://threads.net/@${u.replace('@', '')}`,
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}