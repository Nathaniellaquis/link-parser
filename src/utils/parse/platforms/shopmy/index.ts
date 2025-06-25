import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const shopmy: PlatformModule = {
    id: Platforms.ShopMy,
    name: 'ShopMy',
    domains: ['shopmy.us'],
    patterns: {
        profile: /^https?:\/\/(?:www\.)?shopmy\.us\/([A-Za-z0-9_-]{2,})$/i,
        handle: /^[A-Za-z0-9_-]{2,}$/,
        content: {
            collection: /^https?:\/\/(?:www\.)?shopmy\.us\/collections\/(\d+)$/i,
            product: /^https?:\/\/(?:www\.)?shopmy\.us\/p\/([A-Za-z0-9]{2,})$/i,
        },
    },
    detect: (url: string): boolean => {
        if (!url.includes('shopmy.us')) return false

        // Check if it matches any valid pattern
        if (/^https?:\/\/(?:www\.)?shopmy\.us\/[A-Za-z0-9_-]{2,}$/i.test(url)) return true
        if (/^https?:\/\/(?:www\.)?shopmy\.us\/collections\/\d+$/i.test(url)) return true
        if (/^https?:\/\/(?:www\.)?shopmy\.us\/p\/[A-Za-z0-9]{2,}$/i.test(url)) return true

        return false
    },
    extract: (url: string, result: ParsedUrl) => {
        // Handle collection URLs
        const collectionMatch = /^https?:\/\/(?:www\.)?shopmy\.us\/collections\/(\d+)$/i.exec(url)
        if (collectionMatch) {
            result.ids.collectionId = collectionMatch[1]
            result.metadata.isCollection = true
            result.metadata.contentType = 'collection'
            return
        }

        // Handle product URLs
        const productMatch = /^https?:\/\/(?:www\.)?shopmy\.us\/p\/([A-Za-z0-9]{2,})$/i.exec(url)
        if (productMatch) {
            result.ids.productId = productMatch[1]
            result.metadata.isProduct = true
            result.metadata.contentType = 'product'
            return
        }

        // Handle profile URLs
        const profileMatch = /^https?:\/\/(?:www\.)?shopmy\.us\/([A-Za-z0-9_-]{2,})$/i.exec(url)
        if (profileMatch) {
            result.username = profileMatch[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'storefront'
        }
    },
    validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
    buildProfileUrl: (username: string): string => `https://shopmy.us/${username}`,
    normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
} 