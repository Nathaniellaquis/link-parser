import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const onlyfans: PlatformModule = {
  id: Platforms.OnlyFans,
  name: 'OnlyFans',
  domains: ['onlyfans.com'],
  patterns: {
    profile: /^https?:\/\/(?:www\.)?onlyfans\.com\/([A-Za-z0-9_-]{3,60})$/i,
    handle: /^[A-Za-z0-9_-]{3,60}$/,
  },
  detect: (url: string): boolean => {
    if (!url.includes('onlyfans.com')) return false
    return /^https?:\/\/(?:www\.)?onlyfans\.com\/[A-Za-z0-9_-]{3,60}$/i.test(url)
  },
  extract: (url: string, res: ParsedUrl) => {
    const m = /^https?:\/\/(?:www\.)?onlyfans\.com\/([A-Za-z0-9_-]{3,60})$/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{3,60}$/.test(h),
  buildProfileUrl: (u: string): string => `https://onlyfans.com/${u}`,
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}