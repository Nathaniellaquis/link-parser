import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const mediakits: PlatformModule = {
    id: Platforms.MediaKits,
    name: 'MediaKits',
    color: '#000000',

    domains: ['mediakits.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?mediakits\.com\/([A-Za-z0-9_.-]{3,40})\/?$/i,
        handle: /^[A-Za-z0-9_.-]{3,40}$/,
    },

    detect(url: string): boolean {
        return url.includes('mediakits.com') && this.patterns.profile.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const prof = this.patterns.profile.exec(url)
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
        return `https://mediakits.com/${username}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 