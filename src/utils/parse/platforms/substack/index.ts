import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const substack: PlatformModule = {
  id: Platforms.Substack,
  name: 'Substack',
  domains: ['substack.com'],
  patterns: {
    profile: /([a-z0-9-]+)\.substack\.com/i,
    handle: /^[a-z0-9-]+$/,
  },
  detect: url => url.includes('.substack.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /([a-z0-9-]+)\.substack\.com/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'newsletter'
    }
  },
  validateHandle: h => /^[a-z0-9-]+$/.test(h),
  buildProfileUrl: u => `https://${u}.substack.com`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}