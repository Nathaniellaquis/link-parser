import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const mixcloud: PlatformModule = {
    id: Platforms.Mixcloud,
    name: 'Mixcloud',
    color: '#52BAD5',

    domains: ['mixcloud.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?mixcloud\.com\/([A-Za-z0-9_-]{3,30})\/?$/i,
        handle: /^[A-Za-z0-9_-]{3,30}$/,
        content: {
            track: /^https?:\/\/(?:www\.)?mixcloud\.com\/([A-Za-z0-9_-]{3,30})\/([A-Za-z0-9_-]{3,120})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('mixcloud.com')) return false
        const p = this.patterns
        return p.profile.test(url) || !!p.content?.track?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const prof = patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
            return
        }
        const tr = patterns.content?.track?.exec(url)
        if (tr) {
            res.username = tr[1]
            res.ids.trackSlug = tr[2]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(handle: string): string {
        return `https://www.mixcloud.com/${handle}/`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 