import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bluesky: PlatformModule = {
  id: Platforms.Bluesky,
  name: 'Bluesky',
  domains: ['bsky.app'],
  patterns: {
    profile: /^https?:\/\/bsky\.app\/profile\/([a-zA-Z0-9.-]+\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)$/i,
    handle: /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
    content: {
      post: /^https?:\/\/bsky\.app\/profile\/([a-zA-Z0-9.-]+\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)\/post\/([a-zA-Z0-9]{2,})$/i,
    },
  },
  detect: (url: string): boolean => {
    if (!url.includes('bsky.app')) return false

    // Check if it matches any valid pattern
    if (/^https?:\/\/bsky\.app\/profile\/([a-zA-Z0-9.-]+\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)(?:\/post\/[a-zA-Z0-9]{2,})?$/i.test(url)) {
      return true
    }

    return false
  },
  extract: (url: string, res: ParsedUrl) => {
    // Handle post URLs
    const postMatch = /^https?:\/\/bsky\.app\/profile\/([a-zA-Z0-9.-]+\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)\/post\/([a-zA-Z0-9]{2,})$/i.exec(url)
    if (postMatch) {
      res.username = postMatch[1]
      res.ids.postId = postMatch[2]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle profile URLs
    const profileMatch = /^https?:\/\/bsky\.app\/profile\/([a-zA-Z0-9.-]+\.[a-zA-Z]+|did:[a-z]+:[a-zA-Z0-9]+)$/i.exec(url)
    if (profileMatch) {
      res.username = profileMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: (h: string): boolean => {
    // Check if it's a regular handle or a DID
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(h) || /^did:[a-z]+:[a-zA-Z0-9]+$/.test(h)
  },
  buildProfileUrl: (u: string): string => {
    // Add default domain if not present
    const handle = u.includes('.') || u.startsWith('did:') ? u : `${u}.bsky.social`
    return `https://bsky.app/profile/${handle}`
  },
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}