import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['commerce.coinbase.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const coinbasecommerce: PlatformModule = {
    id: Platforms.CoinbaseCommerce,
    name: 'CoinbaseCommerce',
    color: '#1652F0',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: /^$/,
        handle: /^$/,
        content: {
            checkout: new RegExp(`^https?://${DOMAIN_PATTERN}/checkout/([a-f0-9]{64})/?${QUERY_HASH}$`, 'i')
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return !!(this.patterns.content?.checkout?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const m = this.patterns.content?.checkout?.exec(url)
        if (m) {
            result.ids.checkoutId = m[1]
            result.metadata.contentType = 'payment'
        }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://commerce.coinbase.com' },
    buildContentUrl(_: string, id: string): string { return `https://commerce.coinbase.com/checkout/${id}` },
    normalizeUrl(url: string): string { return normalize(url) },
} 