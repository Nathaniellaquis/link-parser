import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const calendly: PlatformModule = {
    id: Platforms.Calendly,
    name: 'Calendly',
    color: '#006BFF',

    domains: ['calendly.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?calendly\.com\/([A-Za-z0-9_.-]{3,30})\/?$/i,
        handle: /^[A-Za-z0-9_.-]{3,30}$/,
        content: {
            event: /^https?:\/\/(?:www\.)?calendly\.com\/([A-Za-z0-9_.-]{3,30})\/([A-Za-z0-9_-]{3,40})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('calendly.com')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.event?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const match = this.patterns.content?.event?.exec(url)
        if (match) {
            res.username = match[1]
            res.ids.eventType = match[2]
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
        return `https://calendly.com/${username}`
    },

    buildContentUrl(contentType: string, type: string): string {
        if (contentType === 'event') return `https://calendly.com/undefined/${type}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 