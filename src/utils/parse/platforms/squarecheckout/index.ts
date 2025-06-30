import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['square.link', 'checkout.square.site']
const subdomains: string[] = []

// DOMAIN_PATTERN not used due to Square Checkout's specific domain requirements
// We keep domains and subdomains for architectural consistency

export const squarecheckout: PlatformModule = {
    id: Platforms.SquareCheckout,
    name: 'SquareCheckout',
    color: '#28C101',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        // Note: Square Checkout patterns need specific domain matching (square.link vs checkout.square.site)
        // and can't use DOMAIN_PATTERN due to different path structures on each domain
        profile: /^$/,
        handle: /^$/,
        content: {
            pay: new RegExp(`^https?://(?:square\\.link|checkout\\.square\\.site)/pay/([a-zA-Z0-9]{8,})/?${QUERY_HASH}$`, 'i')
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return !!(this.patterns.content?.pay?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const m = this.patterns.content?.pay?.exec(url)
        if (m) {
            result.ids.code = m[1]
            result.metadata.contentType = 'payment'
        }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://squareup.com' },
    buildContentUrl(_: string, id: string): string { return `https://square.link/pay/${id}` },
    normalizeUrl(url: string): string { return normalize(url) },
} 