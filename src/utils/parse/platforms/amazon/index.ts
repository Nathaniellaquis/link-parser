import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const amazon: PlatformModule = {
  id: Platforms.Amazon,
  name: 'Amazon Storefront',
  domains: ['amazon.com'],
  patterns: {
    profile: /amazon\.com\/shop\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]+$/,
  },
  detect: url => url.includes('amazon.com/shop'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /amazon\.com\/shop\/([A-Za-z0-9_-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'storefront'
    }
  },
  validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
  buildProfileUrl: u => `https://amazon.com/shop/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}