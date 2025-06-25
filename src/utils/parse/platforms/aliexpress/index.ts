import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const productIdPattern = '100\\d{9,}'

const productRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?aliexpress\\.com\\/(?:item|i|product)\\/(${productIdPattern})(?:\\.html)?(?:\\?.*)?$`, 'i')

export const aliexpress: PlatformModule = {
    id: Platforms.AliExpress,
    name: 'AliExpress',
    color: '#FF0000',

    domains: ['aliexpress.com'],

    patterns: {
        profile: /^$/, handle: /^$/, content: { product: productRegex },
    },

    detect(url: string): boolean {
        return url.includes('aliexpress.com') && productRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const m = productRegex.exec(url)
        if (m) {
            result.ids.productId = m[1]
            result.metadata.contentType = 'product'
        }
    },

    validateHandle(): boolean { return false },

    buildProfileUrl(): string { return 'https://aliexpress.com' },

    buildContentUrl(t: string, id: string): string {
        return `https://www.aliexpress.com/item/${id}.html`
    },

    normalizeUrl(url: string): string { return normalize(url.replace(/\?.*$/, '').replace(/#.*/, '')) },
} 