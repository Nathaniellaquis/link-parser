import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const cameo: PlatformModule = {
    id: Platforms.Cameo,
    name: 'Cameo',
    color: '#EB1C2D',

    domains: ['cameo.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?cameo\.com\/([A-Za-z0-9_.]{3,40})\/?$/i,
        handle: /^[A-Za-z0-9_.]{3,40}$/,
        content: {
            category: /^https?:\/\/(?:www\.)?cameo\.com\/c\/([A-Za-z0-9_-]{3,40})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('cameo.com')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.category?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const cat = patterns.content?.category?.exec(url)
        if (cat) {
            res.username = cat[1]
            res.metadata.isCategory = true
            res.metadata.contentType = 'category'
            return
        }
        const prof = patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://cameo.com/${username}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 