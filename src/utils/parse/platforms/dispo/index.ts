import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const dispo: PlatformModule = {
    id: Platforms.Dispo,
    name: 'Dispo',
    color: '#FFCC00',

    domains: ['dispo.fun'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?dispo\.fun\/@([A-Za-z0-9_.]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.]{3,30}$/,
        content: {
            roll: /^https?:\/\/(?:www\.)?dispo\.fun\/r\/([A-Za-z0-9_-]{3,40})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('dispo.fun')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.roll?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const roll = this.patterns.content?.roll?.exec(url)
        if (roll) {
            res.ids.rollId = roll[1]
            res.metadata.isRoll = true
            res.metadata.contentType = 'roll'
            return
        }
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
        return `https://dispo.fun/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'roll') {
            return `https://dispo.fun/r/${id}`
        }
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 