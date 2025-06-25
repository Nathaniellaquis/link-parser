import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bandsintown: PlatformModule = {
    id: Platforms.BandsInTown,
    name: 'BandsInTown',
    color: '#00B4B3',

    domains: ['bandsintown.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?bandsintown\.com\/a\/(\d+)\/?$/i,
        handle: /^\d+$/,
        content: {
            event: /^https?:\/\/(?:www\.)?bandsintown\.com\/e\/(\d+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('bandsintown.com')) return false
        return this.patterns.profile.test(url) || !!this.patterns.content?.event?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const ev = this.patterns.content?.event?.exec(url)
        if (ev) {
            res.ids.eventId = ev[1]
            res.metadata.isEvent = true
            res.metadata.contentType = 'event'
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
        return `https://bandsintown.com/a/${id}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'event') return `https://bandsintown.com/e/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 