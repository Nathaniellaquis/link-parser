import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const revolve: PlatformModule = {
    id: Platforms.Revolve,
    name: 'Revolve',
    color: '#000000',

    domains: ['revolve.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?revolve\.com\/brands\/([A-Za-z0-9_-]+)\/?$/i,
        handle: /^[A-Za-z0-9_-]{3,40}$/,
        content: {
            product: /^https?:\/\/(?:www\.)?revolve\.com\/([A-Za-z0-9_-]+)\/dp\/([A-Za-z0-9]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('revolve.com')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.product?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const prod = this.patterns.content?.product?.exec(url)
        if (prod) {
            res.ids.productSlug = prod[1]
            res.ids.productCode = prod[2]
            res.metadata.isProduct = true
            res.metadata.contentType = 'product'
            return
        }
        const brand = this.patterns.profile.exec(url)
        if (brand) {
            res.username = brand[1]
            res.metadata.isBrand = true
            res.metadata.contentType = 'brand'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(brand: string): string {
        return `https://revolve.com/brands/${brand}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'product') {
            return `https://revolve.com/${id}`
        }
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 