import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const productIdPattern = '[a-f0-9]{24}'

const productRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?wish\\.com\\/product\\/(${productIdPattern})(?:\\?.*)?$`, 'i')

export const wish: PlatformModule = {
    id: Platforms.Wish,
    name: 'Wish',
    color: '#2FB7EC',

    domains: ['wish.com'],

    patterns: { profile: /^$/, handle: /^$/, content: { product: productRegex } },

    detect(url: string): boolean { return url.includes('wish.com/product') && productRegex.test(url) },

    extract(url: string, result: ParsedUrl): void {
        const m = productRegex.exec(url)
        if (m) { result.ids.productId = m[1]; result.metadata.contentType = 'product' }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://wish.com' },
    buildContentUrl(t: string, id: string): string { return `https://www.wish.com/product/${id}` },
    normalizeUrl(url: string): string { return normalize(url.replace(/\?.*$/, '').replace(/#.*/, '')) },
} 