import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const slushy: PlatformModule = {
    id: Platforms.Slushy,
    name: 'Slushy',
    color: '#0082FF',

    domains: ['slushy.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?slushy\.com\/@([A-Za-z0-9_.-]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.-]{3,30}$/,
    },

    detect(url: string): boolean {
        return url.includes('slushy.com') && this.patterns.profile.test(url)
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
        return `https://slushy.com/@${username.replace(/^@/, '')}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 