import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const itemIdPattern = '\\d{9,12}'

const itemRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?ebay\\.com\\/itm(?:\\/[A-Za-z0-9-]+)?\\/(${itemIdPattern})(?:\\?.*)?$`, 'i')
const shortItemRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?ebay\\.com\\/itm\\/(${itemIdPattern})(?:\\?.*)?$`, 'i')

export const ebay: PlatformModule = {
    id: Platforms.EBay,
    name: 'eBay',
    color: '#E53238',

    domains: ['ebay.com'],

    patterns: {
        profile: /^$/, // not implemented
        handle: /^$/, // no handle validation
        content: {
            item: itemRegex,
            itemShort: shortItemRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('ebay.com')) return false
        return itemRegex.test(url) || shortItemRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const m = itemRegex.exec(url) || shortItemRegex.exec(url)
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
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 