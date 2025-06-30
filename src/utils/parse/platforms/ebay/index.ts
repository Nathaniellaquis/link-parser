import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['ebay.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const itemIdPattern = '\\d{9,12}'

export const ebay: PlatformModule = {
    id: Platforms.EBay,
    name: 'eBay',
    color: '#E53238',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: /^$/, // not implemented
        handle: /^$/, // no handle validation
        content: {
            item: new RegExp(`^https?://${DOMAIN_PATTERN}/itm(?:/[A-Za-z0-9-]+)?/(${itemIdPattern})/?${QUERY_HASH}$`, 'i'),
            itemShort: new RegExp(`^https?://${DOMAIN_PATTERN}/itm/(${itemIdPattern})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return !!(this.patterns.content?.item?.test(url) || this.patterns.content?.itemShort?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const m = this.patterns.content?.item?.exec(url) || this.patterns.content?.itemShort?.exec(url)
        if (m) {
            result.ids.itemId = m[1]
            result.metadata.contentType = 'item'
        }
    },

    validateHandle(): boolean {
        return false
    },

    buildProfileUrl(): string {
        return 'https://www.ebay.com/'
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'item') return `https://www.ebay.com/itm/${id}`
        return `https://www.ebay.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 