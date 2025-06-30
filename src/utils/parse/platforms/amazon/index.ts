import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['amazon.com']
const subdomains = ['smile']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const amazon: PlatformModule = {
  id: Platforms.Amazon,
  name: 'Amazon',
  color: '#FF9900',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/shop/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]+$/,
    content: {
      product: new RegExp(`^https?://${DOMAIN_PATTERN}/.+/dp/([A-Z0-9]{10})/?${QUERY_HASH}$`, 'i'),
      productShort: new RegExp(`^https?://${DOMAIN_PATTERN}/dp/([A-Z0-9]{10})/?${QUERY_HASH}$`, 'i'),
      store: new RegExp(`^https?://${DOMAIN_PATTERN}/stores/page/([A-Z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
      review: new RegExp(`^https?://${DOMAIN_PATTERN}/review/(R[A-Z0-9]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false
    if (this.patterns.profile.test(url)) return true
    for (const p of Object.values(this.patterns.content || {})) {
      if (p && p.test(url)) return true
    }
    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for product (with path)
    const productMatch = this.patterns.content?.product?.exec(url)
    if (productMatch) {
      result.ids.productId = productMatch[1]
      result.metadata.contentType = 'product'
      result.metadata.isProduct = true
      return
    }

    // Check for product (short form)
    const productShortMatch = this.patterns.content?.productShort?.exec(url)
    if (productShortMatch) {
      result.ids.productId = productShortMatch[1]
      result.metadata.contentType = 'product'
      result.metadata.isProduct = true
      return
    }

    // Check for store
    const storeMatch = this.patterns.content?.store?.exec(url)
    if (storeMatch) {
      result.ids.storeId = storeMatch[1]
      result.metadata.contentType = 'store'
      result.metadata.isStore = true
      return
    }

    // Check for review
    const reviewMatch = this.patterns.content?.review?.exec(url)
    if (reviewMatch) {
      result.ids.reviewId = reviewMatch[1]
      result.metadata.contentType = 'review'
      result.metadata.isReview = true
      return
    }

    // Check for shop profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.username = profileMatch[1]
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