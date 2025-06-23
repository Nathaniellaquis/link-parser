import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const tumblr: PlatformModule = {
  id: Platforms.Tumblr,
  name: 'Tumblr',
  domains: ['tumblr.com'],
  patterns: {
    profile: /([a-zA-Z0-9-]+)\.tumblr\.com/i,
    handle: /^[a-zA-Z0-9-]+$/,
  },
  detect: url => url.includes('tumblr.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /([a-zA-Z0-9-]+)\.tumblr\.com/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[a-zA-Z0-9-]+$/.test(h),
  buildProfileUrl: u => `https://${u}.tumblr.com`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}