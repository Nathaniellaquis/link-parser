import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const amazon: PlatformModule = {
  id: Platforms.Amazon,
  name: 'Amazon',
  color: '#FF9900',

  domains: ['amazon.com', 'www.amazon.com', 'smile.amazon.com'],

  patterns: {
    profile: /^https?:\/\/(www\.)?amazon\.com\/shop\/([A-Za-z0-9_-]+)$/i,
    handle: /^[A-Za-z0-9_-]+$/,
    content: {
      product: /^https?:\/\/(www\.)?amazon\.com\/.*\/dp\/([A-Z0-9]{10})$/i,
      productShort: /^https?:\/\/(www\.)?amazon\.com\/dp\/([A-Z0-9]{10})$/i,
      store: /^https?:\/\/(www\.)?amazon\.com\/stores\/page\/([A-Z0-9]{2,})$/i,
      review: /^https?:\/\/(www\.)?amazon\.com\/review\/(R[A-Z0-9]+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!url.includes('amazon.com')) return false

    // Check if it matches any valid pattern
    if (this.patterns.content?.product?.test(url)) return true
    if (this.patterns.content?.productShort?.test(url)) return true
    if (this.patterns.content?.store?.test(url)) return true
    if (this.patterns.content?.review?.test(url)) return true
    if (this.patterns.profile.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for product (with path)
    const productMatch = this.patterns.content?.product?.exec(url)
    if (productMatch) {
      result.ids.productId = productMatch[2]
      result.metadata.contentType = 'product'
      return
    }

    // Check for product (short form)
    const productShortMatch = this.patterns.content?.productShort?.exec(url)
    if (productShortMatch) {
      result.ids.productId = productShortMatch[2]
      result.metadata.contentType = 'product'
      return
    }

    // Check for store
    const storeMatch = this.patterns.content?.store?.exec(url)
    if (storeMatch) {
      result.ids.storeId = storeMatch[2]
      result.metadata.contentType = 'store'
      return
    }

    // Check for review
    const reviewMatch = this.patterns.content?.review?.exec(url)
    if (reviewMatch) {
      result.ids.reviewId = reviewMatch[2]
      result.metadata.contentType = 'review'
      return
    }

    // Check for shop profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[2]
      result.metadata.isProfile = true
      result.metadata.contentType = 'storefront'
      return
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://amazon.com/shop/${username}`
  },

  buildContentUrl(contentType: string, id: string): string {
    switch (contentType) {
      case 'product':
        return `https://amazon.com/dp/${id}`
      case 'store':
        return `https://amazon.com/stores/page/${id}`
      case 'review':
        return `https://amazon.com/review/${id}`
      default:
        return `https://amazon.com/${contentType}/${id}`
    }
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/smile\.amazon\.com/, 'amazon.com'))
  },
}