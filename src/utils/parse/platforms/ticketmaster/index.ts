import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const ticketmaster: PlatformModule = {
    id: Platforms.Ticketmaster,
    name: 'Ticketmaster',
    color: '#003087',

    domains: ['ticketmaster.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?ticketmaster\.com\/artist\/([A-Za-z0-9]+)\/?$/i,
        handle: /^[A-Za-z0-9]+$/,
        content: {
            event: /^https?:\/\/(?:www\.)?ticketmaster\.com\/event\/([A-Za-z0-9]+)\/?$/i,
            venue: /^https?:\/\/(?:www\.)?ticketmaster\.com\/venue\/([A-Za-z0-9]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('ticketmaster.com')) return false
        const p = this.patterns
        return p.profile.test(url) || !!p.content?.event?.test(url) || !!p.content?.venue?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const ev = this.patterns.content?.event?.exec(url)
        if (ev) {
            res.ids.eventId = ev[1]
            res.metadata.isEvent = true
            res.metadata.contentType = 'event'
            return
        }
        const venue = this.patterns.content?.venue?.exec(url)
        if (venue) {
            res.ids.venueId = venue[1]
            res.metadata.isVenue = true
            res.metadata.contentType = 'venue'
            return
        }
        const art = this.patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.isArtist = true
            res.metadata.contentType = 'artist'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(id: string): string {
        return `https://ticketmaster.com/artist/${id}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'event') return `https://ticketmaster.com/event/${id}`
        if (contentType === 'venue') return `https://ticketmaster.com/venue/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 