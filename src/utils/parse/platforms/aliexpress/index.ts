import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['aliexpress.com', 'aliexpress.us', 'aliexpress.ru']
const subdomains = ['m']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const aliexpress: PlatformModule = {
    id: Platforms.AliExpress,
    name: 'AliExpress',
    color: '#FF4747',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/store/(\\d+)/?${QUERY_HASH}$`, 'i'),
        handle: /^[a-zA-Z0-9_-]+$/,
        content: {
            item: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:item|i)/(\\d+)(?:\\.html)?/?${QUERY_HASH}$`, 'i'),
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.item?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const profileMatch = this.patterns.profile.exec(url)
        if (profileMatch) {
            result.ids.storeId = profileMatch[1]
            result.metadata.isProfile = true
            return
        }

        const itemMatch = this.patterns.content?.item?.exec(url)
        if (itemMatch) {
            result.ids.productId = itemMatch[1]
            result.metadata.contentType = 'product'
            result.metadata.isProduct = true
        }
    },

    validateHandle(h: string): boolean { return this.patterns.handle.test(h) },
    buildProfileUrl(storeId: string): string { return `https://www.aliexpress.com/store/${storeId}` },
    buildContentUrl(_t: string, id: string): string {
        return `https://www.aliexpress.com/item/${id}.html`
    },
    normalizeUrl(url: string): string { return url }
} 