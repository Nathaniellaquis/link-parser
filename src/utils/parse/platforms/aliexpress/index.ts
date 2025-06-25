import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const aliexpress: PlatformModule = {
    id: Platforms.AliExpress,
    name: 'AliExpress',
    color: '#FF4747',
    domains: ['aliexpress.com', 'aliexpress.us', 'aliexpress.ru'],
    mobileSubdomains: ['m'],

    patterns: {
        profile: /^https?:\/\/([a-z]+\.)?aliexpress\.(com|us|ru)\/store\/(\d+)/i,
        handle: /^[a-zA-Z0-9_-]+$/,
        content: {
            item: /^https?:\/\/([a-z]+\.)?aliexpress\.(com|us|ru)\/item\/(\d+)\.html/i,
        }
    },

    detect(url: string): boolean {
        return this.patterns.profile.test(url) ||
            (this.patterns.content?.item?.test(url) || false)
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
                result.ids.itemId = itemMatch[3]
                result.metadata.isPost = true
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