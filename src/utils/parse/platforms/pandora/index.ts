import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const pandora: PlatformModule = {
    id: Platforms.Pandora,
    name: 'Pandora',
    color: '#005483',

    domains: ['pandora.com'],

    patterns: {
        // Artist or podcast pages
        profile: /^https?:\/\/(?:www\.)?pandora\.com\/(artist|podcast)\/([A-Za-z0-9_-]{3,100})(?:\/.*)?$/i,
        // Not commonly used publicly, but keep simple rules
        handle: /^[A-Za-z0-9_-]{3,100}$/,
        content: {
            // Station play URLs: /station/play/12345
            station: /^https?:\/\/(?:www\.)?pandora\.com\/station\/play\/(\d+)/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('pandora.com')) return false
        const { patterns } = this
        if (patterns.profile.test(url)) return true
        if (patterns.content?.station?.test(url)) return true
        return false
    },

    extract(url: string, res: ParsedUrl): void {
        const station = this.patterns.content?.station?.exec(url)
        if (station) {
            res.ids.stationId = station[1]
            res.metadata.isStation = true
            res.metadata.contentType = 'station'
            return
        }

        const prof = this.patterns.profile.exec(url)
        if (prof) {
            // prof[1] = 'artist' or 'podcast', prof[2] = slug
            res.username = prof[2]
            if (prof[1] === 'artist') {
                res.metadata.isArtist = true
                res.metadata.contentType = 'artist'
            } else if (prof[1] === 'podcast') {
                res.metadata.isPodcast = true
                res.metadata.contentType = 'podcast'
            }
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        // Default to artist profile
        return `https://pandora.com/artist/${username}`
    },

    normalizeUrl(url: string): string {
        url = url.replace(/^http:\/\//, 'https://')
        url = url.replace(/www\./, '')
        // Remove trailing slash
        url = url.replace(/\/$/, '')
        return url
    },
} 