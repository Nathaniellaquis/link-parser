import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const shopify: PlatformModule = {
  id: Platforms.Shopify,
  name: 'Shopify Store',
  domains: ['myshopify.com'],
  patterns: {
    profile: /^https?:\/\/([a-z0-9-]+)\.myshopify\.com$/i,
    handle: /^[a-z0-9-]+$/i,
    content: {
      product: /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/products\/([a-z0-9-]+)$/i,
      collection: /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/collections\/([a-z0-9-]+)$/i,
      page: /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/pages\/([a-z0-9-]+)$/i,
    },
  },
  detect: (url: string): boolean => {
    if (!url.includes('myshopify.com')) return false

    // Check if it matches any valid pattern
    if (/^https?:\/\/[a-z0-9-]+\.myshopify\.com(?:\/(?:products|collections|pages)\/[a-z0-9-]+)?$/i.test(url)) {
      return true
    }

    return false
  },
  extract: (url: string, res: ParsedUrl) => {
    // Handle product URLs
    const productMatch = /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/products\/([a-z0-9-]+)$/i.exec(url)
    if (productMatch) {
      res.ids.storeName = productMatch[1]
      res.ids.productHandle = productMatch[2]
      res.metadata.isProduct = true
      res.metadata.contentType = 'product'
      return
    }

    // Handle collection URLs
    const collectionMatch = /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/collections\/([a-z0-9-]+)$/i.exec(url)
    if (collectionMatch) {
      res.ids.storeName = collectionMatch[1]
      res.ids.collectionName = collectionMatch[2]
      res.metadata.isCollection = true
      res.metadata.contentType = 'collection'
      return
    }

    // Handle page URLs
    const pageMatch = /^https?:\/\/([a-z0-9-]+)\.myshopify\.com\/pages\/([a-z0-9-]+)$/i.exec(url)
    if (pageMatch) {
      res.ids.storeName = pageMatch[1]
      res.ids.pageSlug = pageMatch[2]
      res.metadata.isPage = true
      res.metadata.contentType = 'page'
      return
    }

    // Handle store URLs
    const storeMatch = /^https?:\/\/([a-z0-9-]+)\.myshopify\.com$/i.exec(url)
    if (storeMatch) {
      res.ids.storeName = storeMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'storefront'
    }
  },
  validateHandle: (h: string): boolean => /^[a-z0-9-]+$/i.test(h),
  buildProfileUrl: (u: string): string => `https://${u}.myshopify.com`,
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}