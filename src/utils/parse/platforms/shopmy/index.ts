import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['shopmy.us']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const shopmy: PlatformModule = {
    id: Platforms.ShopMy,
    name: 'ShopMy',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/(?!collections/)(?!p/)([A-Za-z0-9_-]{2,})/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9_-]{2,}$/,
        content: {
            collection: new RegExp(`^https?://${DOMAIN_PATTERN}/collections/(\\d+)/?${QUERY_HASH}$`, 'i'),
            product: new RegExp(`^https?://${DOMAIN_PATTERN}/p/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!domains.some((domain: string) => url.includes(domain))) return false

        // Check if it matches any valid pattern
        if (this.patterns.profile.test(url)) return true
        if (this.patterns.content) {
            for (const pattern of Object.values(this.patterns.content)) {
                if (pattern && pattern.test(url)) return true
            }
        }

        return false
    },

    extract(url: string, result: ParsedUrl): void {
        // Handle collection URLs first
        const collectionMatch = this.patterns.content?.collection?.exec(url)
        if (collectionMatch) {
            result.ids.collectionId = collectionMatch[1]
            result.metadata.isCollection = true
            result.metadata.contentType = 'collection'
            return
        }

        // Handle product URLs
        const productMatch = this.patterns.content?.product?.exec(url)
        if (productMatch) {
            result.ids.productId = productMatch[1]
            result.metadata.isProduct = true
            result.metadata.contentType = 'product'
            return
        }

        // Handle profile URLs
        const profileMatch = this.patterns.profile.exec(url)
        if (profileMatch) {
            result.username = profileMatch[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'storefront'
        }
    },

    validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
    buildProfileUrl: (username: string): string => `https://shopmy.us/${username}`,
    normalizeUrl: (u: string): string => normalize(u),
} 