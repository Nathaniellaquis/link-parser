import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const shopPattern = /^[A-Za-z0-9][A-Za-z0-9-]{1,30}$/
const listingId = '\\d{9,12}'

const shopRegex = /^https?:\/\/(?:www\.)?etsy\.com\/shop\/([A-Za-z0-9-]{2,32})\/?$/i
const listingRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?etsy\\.com\\/listing\\/(${listingId})(?:\\/[A-Za-z0-9-]+)?\\/?$`, 'i')

export const etsy: PlatformModule = {
    id: Platforms.Etsy,
    name: 'Etsy',
    color: '#F56400',

    domains: ['etsy.com'],

    patterns: {
        profile: shopRegex,
        handle: shopPattern,
        content: {
            listing: listingRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('etsy.com')) return false
        return shopRegex.test(url) || listingRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const l = listingRegex.exec(url)
        if (l) {
            result.ids.listingId = l[1]
            result.metadata.contentType = 'listing'
            return
        }
        const s = shopRegex.exec(url)
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
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 