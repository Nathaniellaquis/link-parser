import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const onlyfans: PlatformModule = {
  id: Platforms.OnlyFans,
  name: 'OnlyFans',
  domains: ['onlyfans.com'],
  patterns: {
    profile: /onlyfans\.com\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]{3,60}$/,
  },
  detect: url => url.includes('onlyfans.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /onlyfans\.com\/([A-Za-z0-9_-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[A-Za-z0-9_-]{3,60}$/.test(h),
  buildProfileUrl: u => `https://onlyfans.com/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}