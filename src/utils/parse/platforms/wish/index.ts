import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const wish: PlatformModule = {
    id: Platforms.Wish,
    name: 'Wish',
    color: '#2FB7EC',

    domains: ['wish.com'],

    patterns: {
        profile: /^$/,
        handle: /^$/,
        content: {
            product: /^https?:\/\/(?:www\.)?wish\.com\/product\/([a-f0-9]{24})/i,
        }
    },

    detect(url: string): boolean {
        return url.includes('wish.com/product/')
    },

    extract(url: string, result: ParsedUrl): void {
        if (this.patterns.content?.product) {
            const match = url.match(this.patterns.content.product)
            if (match) {
                result.ids.productId = match[1]
                result.metadata.contentType = 'product'
            }
        }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://wish.com' },
    buildContentUrl(_t: string, id: string): string { return `https://www.wish.com/product/${id}` },
    normalizeUrl(url: string): string { return url }
} 