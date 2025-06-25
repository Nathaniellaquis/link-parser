import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const kofi: PlatformModule = {
  id: Platforms.KoFi,
  name: 'Ko-fi',
  domains: ['ko-fi.com'],
  patterns: {
    profile: /^https?:\/\/(?:www\.)?ko-fi\.com\/([A-Za-z0-9_-]{2,})$/i,
    handle: /^[A-Za-z0-9_-]{2,}$/,
    content: {
      shop: /^https?:\/\/(?:www\.)?ko-fi\.com\/([A-Za-z0-9_-]+)\/(shop)$/i,
      post: /^https?:\/\/(?:www\.)?ko-fi\.com\/post\/([A-Za-z0-9-]{2,})$/i,
    },
  },
  detect: (url: string): boolean => {
    if (!url.includes('ko-fi.com')) return false

    // Check if it matches any valid pattern
    if (/^https?:\/\/(?:www\.)?ko-fi\.com\/[A-Za-z0-9_-]{2,}(?:\/shop)?$/i.test(url)) return true
    if (/^https?:\/\/(?:www\.)?ko-fi\.com\/post\/[A-Za-z0-9-]{2,}$/i.test(url)) return true

    return false
  },
  extract: (url: string, res: ParsedUrl) => {
    // Handle post URLs
    const postMatch = /^https?:\/\/(?:www\.)?ko-fi\.com\/post\/([A-Za-z0-9-]{2,})$/i.exec(url)
    if (postMatch) {
      res.ids.postId = postMatch[1]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle shop URLs
    const shopMatch = /^https?:\/\/(?:www\.)?ko-fi\.com\/([A-Za-z0-9_-]+)\/(shop)$/i.exec(url)
    if (shopMatch) {
      res.username = shopMatch[1]
      res.ids.shop = shopMatch[2]
      res.metadata.isShop = true
      res.metadata.contentType = 'shop'
      return
    }

    // Handle profile URLs
    const profileMatch = /^https?:\/\/(?:www\.)?ko-fi\.com\/([A-Za-z0-9_-]{2,})$/i.exec(url)
    if (profileMatch) {
      res.username = profileMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
  buildProfileUrl: (u: string): string => `https://ko-fi.com/${u}`,
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}