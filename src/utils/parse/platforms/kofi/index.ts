import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const kofi: PlatformModule = {
  id: Platforms.KoFi,
  name: 'Ko-fi',
  domains: ['ko-fi.com'],
  patterns: {
    profile: /ko-fi\.com\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]+$/,
  },
  detect: url => url.includes('ko-fi.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /ko-fi\.com\/([A-Za-z0-9_-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
  buildProfileUrl: u => `https://ko-fi.com/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}