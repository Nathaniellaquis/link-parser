import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const shopify: PlatformModule = {
  id: Platforms.Shopify,
  name: 'Shopify Store',
  domains: ['shopmy.us', 'myshopify.com'],
  patterns: {
    profile: /https?:\/\/([\w-]+)\.(?:myshopify\.com|shopmy\.us)/i,
    handle: /^[A-Za-z0-9-]+$/,
  },
  detect: url => /myshopify\.com|shopmy\.us/.test(url),
  extract: (url: string, res: ParsedUrl) => {
    const m = /https?:\/\/([\w-]+)\.(?:myshopify\.com|shopmy\.us)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'storefront'
    }
  },
  validateHandle: h => /^[A-Za-z0-9-]+$/.test(h),
  buildProfileUrl: u => `https://${u}.myshopify.com`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}