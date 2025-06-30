import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['etsy.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const shopPattern = /^[A-Za-z0-9][A-Za-z0-9-]{1,30}$/
const listingId = '\\d{9,12}'

export const etsy: PlatformModule = {
    id: Platforms.Etsy,
    name: 'Etsy',
    color: '#F56400',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/shop/([A-Za-z0-9-]{2,32})/?${QUERY_HASH}$`, 'i'),
        handle: shopPattern,
        content: {
            listing: new RegExp(`^https?://${DOMAIN_PATTERN}/listing/(${listingId})(?:/[A-Za-z0-9-]+)?/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.listing?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const l = this.patterns.content?.listing?.exec(url)
        if (l) {
            result.ids.listingId = l[1]
            result.metadata.contentType = 'listing'
            return
        }
        const s = this.patterns.profile.exec(url)
        if (s) {
            result.username = s[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'shop'
        }
    },

    validateHandle(handle: string): boolean {
        return shopPattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.etsy.com/shop/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'listing') return `https://www.etsy.com/listing/${id}`
        return `https://www.etsy.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 