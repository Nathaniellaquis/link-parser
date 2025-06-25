import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const slugPattern = '[a-z0-9-]+'

const productRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?stockx\\.com\\/(${slugPattern})\\/?$`, 'i')

export const stockx: PlatformModule = {
    id: Platforms.StockX,
    name: 'StockX',
    color: '#136F63',

    domains: ['stockx.com'],

    patterns: {
        profile: /^$/, // N/A
        handle: /^$/,
        content: {
            product: productRegex,
        },
    },

    detect(url: string): boolean {
        return url.includes('stockx.com') && productRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const m = productRegex.exec(url)
        if (m) {
            result.ids.productSlug = m[1]
            result.metadata.contentType = 'product'
        }
    },

    validateHandle(): boolean {
        return false
    },

    buildProfileUrl(): string {
        return 'https://stockx.com/'
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'product') return `https://stockx.com/${id}`
        return `https://stockx.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 