import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bluesky: PlatformModule = {
  id: Platforms.Bluesky,
  name: 'Bluesky',
  domains: ['bsky.app'],
  patterns: {
    profile: /bsky\.app\/profile\/([a-zA-Z0-9.-]+)\/?/i,
    handle: /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
  },
  detect: url => url.includes('bsky.app'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /bsky\.app\/profile\/([a-zA-Z0-9.-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(h),
  buildProfileUrl: u => `https://bsky.app/profile/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}