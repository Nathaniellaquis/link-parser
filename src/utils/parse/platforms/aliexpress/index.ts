import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { QUERY_HASH } from '../../utils/constants'

export const aliexpress: PlatformModule = {
    id: Platforms.AliExpress,
    name: 'AliExpress',
    color: '#FF4747',
    domains: ['aliexpress.com', 'aliexpress.us', 'aliexpress.ru'],
    mobileSubdomains: ['m'],

    patterns: {
        profile: /^https?:\/\/([a-z]+\.)?aliexpress\.(com|us|ru)\/store\/(\d+)\/?${QUERY_HASH}$/i,
        handle: /^[a-zA-Z0-9_-]+$/,
        content: {
            item: new RegExp(`^https?:\\/\\/([a-z]+\\.)?aliexpress\\.(com|us|ru)\\\/(?:item|i)\\/(\\d+)(?:\\.html)?\\/?${QUERY_HASH}$`, 'i'),
        }
    },

    detect(url: string): boolean {
        return this.patterns.profile.test(url) ||
            (!!this.patterns.content?.item && this.patterns.content.item.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const profileMatch = url.match(this.patterns.profile)
        if (profileMatch) {
            result.ids.storeId = profileMatch[3]
            result.metadata.isProfile = true
            return
        }

        if (this.patterns.content?.item) {
            const itemMatch = url.match(this.patterns.content.item)
            if (itemMatch) {
                result.ids.productId = itemMatch[3]
                result.metadata.contentType = 'product'
                result.metadata.isProduct = true
            }
        }
    },

    validateHandle(h: string): boolean { return this.patterns.handle.test(h) },
    buildProfileUrl(storeId: string): string { return `https://www.aliexpress.com/store/${storeId}` },
    buildContentUrl(_t: string, id: string): string {
        return `https://www.aliexpress.com/item/${id}.html`
    },
    normalizeUrl(url: string): string { return url }
} 