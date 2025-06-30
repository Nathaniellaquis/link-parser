import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['wish.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const wish: PlatformModule = {
    id: Platforms.Wish,
    name: 'Wish',
    color: '#2FB7EC',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: /^$/,
        handle: /^$/,
        content: {
            product: new RegExp(`^https?://${DOMAIN_PATTERN}/product/([a-f0-9]{24})/?${QUERY_HASH}$`, 'i'),
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return !!(this.patterns.content?.product?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const match = this.patterns.content?.product?.exec(url)
        if (match) {
            result.ids.productId = match[1]
            result.metadata.contentType = 'product'
        }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://wish.com' },
    buildContentUrl(_t: string, id: string): string { return `https://www.wish.com/product/${id}` },
    normalizeUrl(url: string): string { return url }
} 