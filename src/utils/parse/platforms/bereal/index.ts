import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bereal: PlatformModule = {
    id: Platforms.BeReal,
    name: 'BeReal',
    color: '#000000',

    domains: ['bereal.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?bereal\.com\/([A-Za-z0-9_.-]{3,40})\/?$/i,
        handle: /^@?[A-Za-z0-9_.-]{3,40}$/,
    },

    detect(url: string): boolean {
        if (!url.includes('bereal.com')) return false
        return this.patterns.profile.test(url)
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
        return `https://bereal.com/${username.replace(/^@/, '')}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 