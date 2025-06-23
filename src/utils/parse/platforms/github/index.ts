import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const github: PlatformModule = {
  id: Platforms.GitHub,
  name: 'GitHub',
  domains: ['github.com'],
  patterns: {
    profile: /github\.com\/([A-Za-z0-9-]+)/i,
    handle: /^[A-Za-z0-9-]{1,39}$/,
  },
  detect: url => url.includes('github.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /github\.com\/([A-Za-z0-9-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[A-Za-z0-9-]{1,39}$/.test(h),
  buildProfileUrl: u => `https://github.com/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}