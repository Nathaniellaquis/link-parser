import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const clubhouse: PlatformModule = {
    id: Platforms.Clubhouse,
    name: 'Clubhouse',
    color: '#F5DF4D',

    domains: ['clubhouse.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?clubhouse\.com\/@([A-Za-z0-9_.]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.]{3,30}$/,
        content: {
            club: /^https?:\/\/(?:www\.)?clubhouse\.com\/club\/([A-Za-z0-9_.-]{3,50})\/?$/i,
            event: /^https?:\/\/(?:www\.)?clubhouse\.com\/event\/([A-Za-z0-9]{6,})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('clubhouse.com')) return false
        const { patterns } = this
        return (
            patterns.profile.test(url) ||
            !!patterns.content?.club?.test(url) ||
            !!patterns.content?.event?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const clubMatch = this.patterns.content?.club?.exec(url)
        if (clubMatch) {
            res.ids.clubName = clubMatch[1]
            res.metadata.isClub = true
            res.metadata.contentType = 'club'
            return
        }
        const eventMatch = this.patterns.content?.event?.exec(url)
        if (eventMatch) {
            res.ids.eventId = eventMatch[1]
            res.metadata.isEvent = true
            res.metadata.contentType = 'event'
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
        return `https://clubhouse.com/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'club') return `https://clubhouse.com/club/${id}`
        if (contentType === 'event') return `https://clubhouse.com/event/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 